import { readFileSync, writeFileSync } from "fs";

const GITHUB_USERNAME = "OnuegbuUdochukwu";
const DATA_PATH = "src/lib/data.ts";

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

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});

if (!res.ok) {
  console.error("API error:", res.status, await res.text());
  process.exit(1);
}

const json = await res.json();
const calendar =
  json.data?.user?.contributionsCollection?.contributionCalendar;

if (!calendar) {
  console.error("Unexpected response shape:", JSON.stringify(json));
  process.exit(1);
}

const allDays = calendar.weeks.flatMap((w) => w.contributionDays);
const flattened = allDays.map((d) => ({
  date: d.date,
  count: d.contributionCount,
}));

const sorted = [...flattened]
  .filter((d) => d.count > 0)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

let streak = 0;
const today = new Date();
today.setHours(0, 0, 0, 0);

for (let i = 0; i < sorted.length; i++) {
  if (streak === 0) {
    const diff = Math.round(
      (today.getTime() - new Date(sorted[i].date).getTime()) /
        (1000 * 60 * 60 * 24)
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
    (expectedDate.getTime() - new Date(sorted[i].date).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (diff === 1) {
    streak++;
  } else {
    break;
  }
}

let content = readFileSync(DATA_PATH, "utf-8");

const now = new Date();
const monthStr = now.toLocaleString("en-US", {
  month: "long",
  year: "numeric",
});

const dateRegex = /(date:\s*")[A-Z][a-z]+ \d{4}(")/;
const dateMatch = content.match(dateRegex);
if (!dateMatch) {
  console.error('Could not find date field in data.ts (expected pattern: date: "Month Year")');
  process.exit(1);
}
content = content.replace(dateRegex, `$1${monthStr}$2`);

const streakRegex = /("Maintaining a )\d+(-day GitHub contribution streak\.")/;
const streakMatch = content.match(streakRegex);
if (!streakMatch) {
  console.error("Could not find streak text in data.ts");
  process.exit(1);
}
content = content.replace(streakRegex, `$1${streak}$2`);

writeFileSync(DATA_PATH, content);
console.log(`Updated: date → "${monthStr}", streak → ${streak} days`);
