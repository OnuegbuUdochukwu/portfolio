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

const activeDays = new Set(
  flattened.filter((d) => d.count > 0).map((d) => d.date)
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
