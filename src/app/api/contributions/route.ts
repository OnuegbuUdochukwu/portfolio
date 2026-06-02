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
  const activeDays = new Set(
    days.filter((d) => d.count > 0).map((d) => d.date)
  );

  let streak = 0;
  let checkDate = new Date();

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];

    if (activeDays.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (
        streak === 0 &&
        checkDate.toDateString() === new Date().toDateString()
      ) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
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
