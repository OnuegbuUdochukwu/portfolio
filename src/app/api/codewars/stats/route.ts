const CODEWARS_USERNAME = "OnuegbuUdochukwu";
const CODEWARS_API = `https://www.codewars.com/api/v1/users/${CODEWARS_USERNAME}`;

interface CodeWarsResponse {
  username: string;
  name: string;
  honor: number;
  leaderboardPosition: number;
  ranks: {
    overall: { rank: number; name: string; color: string; score: number };
    languages: Record<string, { rank: number; name: string; color: string; score: number }>;
  };
  codeChallenges: { totalAuthored: number; totalCompleted: number };
}

export async function GET() {
  try {
    const res = await fetch(CODEWARS_API, { next: { revalidate: 1800 } });

    if (!res.ok) {
      const errText = await res.text();
      console.error("CodeWars API error:", res.status, errText);
      return Response.json(
        { error: "Failed to fetch CodeWars stats" },
        { status: 502 }
      );
    }

    const json: CodeWarsResponse = await res.json();

    return Response.json({
      totalCompleted: json.codeChallenges.totalCompleted,
      honor: json.honor,
      leaderboardPosition: json.leaderboardPosition,
      overallRank: json.ranks.overall.name,
      overallScore: json.ranks.overall.score,
      languages: json.ranks.languages,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to fetch CodeWars stats:", err);
    return Response.json(
      { error: "Failed to fetch CodeWars stats" },
      { status: 502 }
    );
  }
}
