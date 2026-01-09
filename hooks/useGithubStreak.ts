import { useEffect, useState } from "react";
import { getCurrentStreak, getLongestStreak } from "../utils/stats";

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN ?? "";

/* -------------------------------- TYPES -------------------------------- */

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
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

/* ------------------------------ DATE HELPERS ----------------------------- */

function startOfYear(year: number) {
  return new Date(`${year}-01-01T00:00:00Z`).toISOString();
}

function endOfYear(year: number) {
  return new Date(`${year}-12-31T23:59:59Z`).toISOString();
}

/* --------------------------- MAIN HOOK ----------------------------------- */

export function useGithubStreak(username: string) {
  const cleanUsername = username.trim();

  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);
  const [heatmap, setHeatmap] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cleanUsername) {
      setLoading(false);
      return;
    }

    /* ------------------------------ CACHE ------------------------------ */

    if (
      githubCache &&
      githubCache.username === cleanUsername &&
      Date.now() - githubCache.timestamp < CACHE_TTL
    ) {
      setCurrentStreak(githubCache.currentStreak);
      setLongestStreak(githubCache.longestStreak);
      setTotalCommits(githubCache.totalCommits);
      setHeatmap(githubCache.heatmap);
      setLoading(false);
      return;
    }

    if (!GITHUB_TOKEN) {
      setError("Missing EXPO_PUBLIC_GITHUB_TOKEN in .env");
      setLoading(false);
      return;
    }

    /* ---------------------------- FETCHER ----------------------------- */

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

      if (json.errors?.length) {
        throw new Error(json.errors[0].message);
      }

      const weeks =
        json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ||
        [];

      return weeks.flatMap((w: any) => w.contributionDays);
    }

    /* ----------------------------- MAIN ------------------------------- */

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const CURRENT_YEAR = new Date().getFullYear();
        const START_YEAR = 2023; // your GitHub says "Since 2023"

        const allDays: ContributionDay[] = [];

        // 🔥 Fetch multiple years
        for (let year = START_YEAR; year <= CURRENT_YEAR; year++) {
          const days = await fetchYear(year);
          allDays.push(...days);
        }

        if (!allDays.length) {
          throw new Error("No contribution data found");
        }

        // ✅ Sort strictly by date
        const ordered = allDays.sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        // ✅ Heatmap (full history)
        const heat = ordered.map((d) => d.contributionCount);

        // ✅ Total commits
        const total = heat.reduce((a, b) => a + b, 0);

        // ✅ Streaks
        const current = getCurrentStreak(heat);
        const longest = getLongestStreak(heat);

        // ✅ Cache
        githubCache = {
          username: cleanUsername,
          currentStreak: current,
          longestStreak: longest,
          totalCommits: total,
          heatmap: heat,
          timestamp: Date.now(),
        };

        setCurrentStreak(current);
        setLongestStreak(longest);
        setTotalCommits(total);
        setHeatmap(heat);
      } catch (err: any) {
        console.error("GitHub streak error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [cleanUsername]);

  return {
    currentStreak,
    longestStreak,
    totalCommits,
    heatmap,
    loading,
    error,
  };
}
