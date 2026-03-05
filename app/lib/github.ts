const GITHUB_USERNAME = "divitperiwal";

interface ContributionDay {
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

interface GitHubContributionData {
  grid: number[][];
  totalContributions: number;
  totalCommits: number;
  lastContributionDate: string | null;
}

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function generateFallbackGrid(): number[][] {
  const rows = 7;
  const cols = 52;
  const grid: number[][] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 13) % 2147483647;
    return seed / 2147483647;
  };

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const v = rand();
      const wave = Math.sin(c / 6) * 0.25 + 0.55;
      const weekendDip = r === 0 || r === 6 ? 0.75 : 1;
      const val = v * wave * weekendDip;

      if (val < 0.12) grid[r][c] = 0;
      else if (val < 0.28) grid[r][c] = 1;
      else if (val < 0.42) grid[r][c] = 2;
      else if (val < 0.55) grid[r][c] = 3;
      else grid[r][c] = 4;
    }
  }
  return grid;
}

export async function fetchGitHubContributions(): Promise<GitHubContributionData> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn("GITHUB_TOKEN not set — using fallback contribution grid");
    return {
      grid: generateFallbackGrid(),
      totalContributions: 1247,
      totalCommits: 1200,
      lastContributionDate: null,
    };
  }

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            restrictedContributionsCount
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  contributionLevel
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username: GITHUB_USERNAME } }),
      next: { revalidate: 3600 }, // revalidate every hour
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const json = await res.json();
    const collection = json.data?.user?.contributionsCollection;
    const calendar = collection?.contributionCalendar;

    if (!calendar) {
      throw new Error("Unexpected GitHub API response structure");
    }

    const totalContributions: number = calendar.totalContributions;
    const totalCommits: number =
      (collection.totalCommitContributions ?? 0) +
      (collection.restrictedContributionsCount ?? 0);
    const weeks: { contributionDays: ContributionDay[] }[] = calendar.weeks;

    // GitHub returns weeks as columns (Sun–Sat rows).
    // We need grid[row][col] where row = day-of-week, col = week index.
    // Take the last 52 weeks.
    const recentWeeks = weeks.slice(-52);
    const grid: number[][] = Array.from({ length: 7 }, () => [] as number[]);

    for (const week of recentWeeks) {
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const day = week.contributionDays[dayIdx];
        grid[dayIdx].push(day ? LEVEL_MAP[day.contributionLevel] ?? 0 : 0);
      }
    }

    // Pad to exactly 52 columns if needed
    for (let r = 0; r < 7; r++) {
      while (grid[r].length < 52) {
        grid[r].unshift(0);
      }
    }

    // Find the last contribution date
    let lastContributionDate: string | null = null;
    for (let w = weeks.length - 1; w >= 0; w--) {
      const days = weeks[w].contributionDays;
      for (let d = days.length - 1; d >= 0; d--) {
        if (days[d].contributionCount > 0) {
          lastContributionDate = days[d].date;
          break;
        }
      }
      if (lastContributionDate) break;
    }

    return { grid, totalContributions, totalCommits, lastContributionDate };
  } catch (err) {
    console.error("Failed to fetch GitHub contributions:", err);
    return {
      grid: generateFallbackGrid(),
      totalContributions: 1247,
      totalCommits: 1200,
      lastContributionDate: null,
    };
  }
}

export function formatCommits(count: number): string {
  if (count >= 1000) {
    const k = count / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return count.toString();
}

export function formatLastContribution(dateStr: string | null): string {
  if (!dateStr) return "TODAY";
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "TODAY";

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === yesterday) return "YESTERDAY";

  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) return `${diffDays}D AGO`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}W AGO`;
  return `${Math.floor(diffDays / 30)}M AGO`;
}

export function formatContributions(count: number): string {
  return count.toLocaleString("en-US");
}
