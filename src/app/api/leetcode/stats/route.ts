const LEETCODE_USERNAME = "OnuegbuUdochukwu";
const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

const QUERY = `
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
    }
  }
}
`;

interface LeetCodeResponse {
  data?: {
    matchedUser?: {
      username: string;
      submitStats?: {
        acSubmissionNum?: { difficulty: string; count: number }[];
      };
      profile?: {
        ranking: number;
      };
    };
  };
}

export async function GET() {
  try {
    const res = await fetch(LEETCODE_GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: QUERY,
        variables: { username: LEETCODE_USERNAME },
      }),
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("LeetCode API error:", res.status, errText);
      return Response.json(
        { error: "Failed to fetch LeetCode stats" },
        { status: 502 }
      );
    }

    const json: LeetCodeResponse = await res.json();

    if (json?.data?.matchedUser === null || json?.data?.matchedUser === undefined) {
      return Response.json(
        { error: "LeetCode user not found" },
        { status: 404 }
      );
    }

    const matched = json.data.matchedUser!;
    const stats = matched.submitStats?.acSubmissionNum ?? [];
    const solved: Record<string, number> = {};
    for (const s of stats) {
      solved[s.difficulty] = s.count;
    }

    return Response.json({
      totalSolved: solved.All ?? 0,
      easySolved: solved.Easy ?? 0,
      mediumSolved: solved.Medium ?? 0,
      hardSolved: solved.Hard ?? 0,
      ranking: matched.profile?.ranking ?? 0,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to fetch LeetCode stats:", err);
    return Response.json(
      { error: "Failed to fetch LeetCode stats" },
      { status: 502 }
    );
  }
}
