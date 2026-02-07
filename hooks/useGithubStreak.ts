import { useEffect, useState } from "react";
import { getLongestStreak } from "../utils/stats";

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN ?? "";

type ContributionDay = {
  date: string;
  contributionCount: number;
};

type GithubCache = {
  username: string;
  currentStreak: number;
  longestStreak: number;
  totalCommits: number;
  heatmap: number[];
  timestamp: number;
};

let githubCache: GithubCache | null = null;
const CACHE_TTL = 1000 * 60 * 10;

/* ---------- HELPERS ---------- */

function startOfYear(year: number) {
  return `${year}-01-01T00:00:00Z`;
}

function endOfYear(year: number) {
  return `${year}-12-31T23:59:59Z`;
}

function getSmartCurrentStreak(data: number[]) {
  let i = data.length - 1;
  while (i >= 0 && data[i] === 0) i--;
  let streak = 0;
  while (i >= 0 && data[i] > 0) {
    streak++;
    i--;
  }
  return streak;
}

/* ---------- MAIN HOOK ---------- */

export function useGithubStreak(username: string, enabled = true) {
  const cleanUsername = username.trim();

  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);
  const [heatmap, setHeatmap] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!cleanUsername) {
      setLoading(false);
      setError(null);
      return;
    }

    if (!GITHUB_TOKEN) {
      setError("Missing GitHub token");
      return;
    }

    if (
      githubCache &&
      githubCache.username === cleanUsername &&
      Date.now() - githubCache.timestamp < CACHE_TTL
    ) {
      setCurrentStreak(githubCache.currentStreak);
      setLongestStreak(githubCache.longestStreak);
      setTotalCommits(githubCache.totalCommits);
      setHeatmap(githubCache.heatmap);
      return;
    }

    let cancelled = false;

    async function fetchYear(year: number): Promise<ContributionDay[]> {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query ($username: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            username: cleanUsername,
            from: startOfYear(year),
            to: endOfYear(year),
          },
        }),
      });

      const json = await res.json();
      if (json.errors) return [];

      return (
        json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks
          ?.flatMap((w: any) => w.contributionDays) || []
      );
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const CURRENT_YEAR = new Date().getFullYear();
        const START_YEAR = 2020;

        const days: ContributionDay[] = [];
        for (let y = START_YEAR; y <= CURRENT_YEAR; y++) {
          days.push(...(await fetchYear(y)));
        }

        if (!days.length) {
          setError("No public GitHub contributions");
          return;
        }

        const ordered = days.sort((a, b) => a.date.localeCompare(b.date));
        const series = ordered.map((d) => d.contributionCount);

        const total = series.reduce((a, b) => a + b, 0);
        const longest = getLongestStreak(series);
        const current = getSmartCurrentStreak(series);

        const map = new Map<string, number>();
        ordered.forEach((d) => map.set(d.date, d.contributionCount));

        const heat: number[] = [];
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        for (let i = 89; i >= 0; i--) {
          const d = new Date(today);
          d.setUTCDate(today.getUTCDate() - i);
          heat.push(map.get(d.toISOString().slice(0, 10)) || 0);
        }

        githubCache = {
          username: cleanUsername,
          currentStreak: current,
          longestStreak: longest,
          totalCommits: total,
          heatmap: heat,
          timestamp: Date.now(),
        };

        if (!cancelled) {
          setCurrentStreak(current);
          setLongestStreak(longest);
          setTotalCommits(total);
          setHeatmap(heat);
        }
      } catch {
        setError("Failed to load GitHub data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [cleanUsername, enabled]);

  return {
    currentStreak,
    longestStreak,
    totalCommits,
    heatmap,
    loading,
    error,
  };
}
