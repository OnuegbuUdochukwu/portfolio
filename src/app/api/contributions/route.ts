const GITHUB_USERNAME = "OnuegbuUdochukwu";

interface GraphQLDay {
  contributionCount: number;
  date: string;
}

interface GraphQLWeek {
  contributionDays: GraphQLDay[];
}

interface GraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: GraphQLWeek[];
        };
      };
    };
  };
}

function contributionCountToLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function calculateStreak(days: { date: string; count: number }[]): number {
  const sorted = [...days]
    .filter((d) => d.count > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - streak - (streak === 0 ? 0 : 1));

    const dayDate = new Date(sorted[i].date);
    dayDate.setHours(0, 0, 0, 0);

    if (streak === 0) {
      const diff = Math.round(
        (today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 0 || diff === 1) {
        streak = 1;
        continue;
      }
      break;
    }

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - streak);
    expectedDate.setHours(0, 0, 0, 0);

    const diff = Math.round(
      (expectedDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function GET() {
  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GitHub API error:", res.status, errText);
      return Response.json(
        { error: "Failed to fetch contributions" },
        { status: 502 }
      );
    }

    const json: GraphQLResponse = await res.json();

    if (!json.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error("Unexpected GraphQL response:", JSON.stringify(json));
      return Response.json(
        { error: "Unexpected GitHub API response shape" },
        { status: 502 }
      );
    }

    const calendar = json.data.user.contributionsCollection.contributionCalendar;
    const allDays = calendar.weeks.flatMap((w) => w.contributionDays);
    const flattened = allDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: contributionCountToLevel(d.contributionCount),
    }));

    const streak = calculateStreak(flattened);

    return Response.json({
      totalContributions: calendar.totalContributions,
      currentStreak: streak,
      days: flattened,
      startDate: flattened[0]?.date,
      endDate: flattened[flattened.length - 1]?.date,
    });
  } catch (err) {
    console.error("Failed to fetch GitHub contributions:", err);
    return Response.json(
      { error: "Failed to fetch contributions" },
      { status: 502 }
    );
  }
}
