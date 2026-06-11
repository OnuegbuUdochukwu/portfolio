function parseRepo(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/^\//, "").split("/");
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
    return null;
  } catch {
    return null;
  }
}

interface CommitNode {
  sha: string;
  message: string;
  date: string;
  author: string;
  parents: string[];
}

interface BranchNode {
  name: string;
  latestSha: string;
}

interface CommitEdge {
  from: string;
  to: string;
}

interface GraphData {
  commits: CommitNode[];
  branches: BranchNode[];
  edges: CommitEdge[];
  defaultBranch: string;
}

interface GraphQLCommit {
  oid: string;
  message: string;
  committedDate: string;
  author: { name: string } | null;
  parents: { nodes: { oid: string }[] };
}

const PER_BRANCH = 60;

function buildQuery(owner: string, repo: string): string {
  return `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        defaultBranchRef { name }
        refs(refPrefix: "refs/heads/", first: 15, orderBy: { field: ALPHABETICAL, direction: ASC }) {
          nodes {
            name
            target {
              ... on Commit {
                oid
                history(first: ${PER_BRANCH}) {
                  nodes {
                    oid
                    message
                    committedDate
                    author { name }
                    parents(first: 10) { nodes { oid } }
                  }
                  pageInfo { hasNextPage }
                }
              }
            }
          }
        }
      }
    }
  `;
}

function extractCommits(branches: any[], defaultBranch: string): GraphData {
  const commitMap = new Map<string, CommitNode>();
  const branchNodes: BranchNode[] = [];
  const seen = new Set<string>();

  for (const branch of branches) {
    const branchName = branch.name;
    const history = branch.target?.history;
    if (!history?.nodes) continue;

    const tipSha = history.nodes[0]?.oid;
    if (tipSha) branchNodes.push({ name: branchName, latestSha: tipSha });

    for (const c of history.nodes) {
      if (!c || seen.has(c.oid)) continue;
      seen.add(c.oid);

      commitMap.set(c.oid, {
        sha: c.oid,
        message: c.message?.split("\n")[0] || "",
        date: c.committedDate,
        author: c.author?.name || "",
        parents: (c.parents?.nodes || []).map((p: any) => p.oid),
      });
    }
  }

  const commits = Array.from(commitMap.values());
  const edges: CommitEdge[] = [];
  for (const c of commits) {
    for (const p of c.parents) {
      if (commitMap.has(p)) edges.push({ from: c.sha, to: p });
    }
  }

  return { commits, branches: branchNodes, edges, defaultBranch };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  let resolvedOwner: string;
  let resolvedRepo: string;

  if (url) {
    const parsed = parseRepo(url);
    if (!parsed) {
      return Response.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }
    resolvedOwner = parsed.owner;
    resolvedRepo = parsed.repo;
  } else if (owner && repo) {
    resolvedOwner = owner;
    resolvedRepo = repo;
  } else {
    return Response.json(
      { error: "Provide ?url= or ?owner=&repo=" },
      { status: 400 }
    );
  }

  const query = buildQuery(resolvedOwner, resolvedRepo);

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GitHub API error:", res.status, errText);
      return Response.json({ error: "Failed to fetch commits" }, { status: 502 });
    }

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL errors:", JSON.stringify(json.errors));
      return Response.json({ error: "GraphQL error" }, { status: 502 });
    }

    const repoData = json.data?.repository;
    if (!repoData) {
      return Response.json({ error: "Repository not found" }, { status: 404 });
    }

    const defaultBranch = repoData.defaultBranchRef?.name || "main";
    const branches = repoData.refs?.nodes || [];
    const data = extractCommits(branches, defaultBranch);

    return Response.json(data);
  } catch (err) {
    console.error("Failed to fetch GitHub commits:", err);
    return Response.json({ error: "Failed to fetch commits" }, { status: 502 });
  }
}
