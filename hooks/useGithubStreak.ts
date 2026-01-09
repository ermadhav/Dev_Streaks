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

/* ---------------- DATE HELPERS ---------------- */

function startOfYear(year: number) {
  return `${year}-01-01T00:00:00Z`;
}

function endOfYear(year: number) {
  return `${year}-12-31T23:59:59Z`;
}

/* ---------------- SAFE CURRENT STREAK ---------------- */

function getSmartCurrentStreakFull(data: number[]) {
  if (!data.length) return 0;

  // ✅ Find last day that actually has commits
  let i = data.length - 1;
  while (i >= 0 && data[i] === 0) {
    i--;
  }

  if (i < 0) return 0;

  let streak = 0;

  // ✅ Count backwards until a zero appears
  for (; i >= 0; i--) {
    if (data[i] > 0) streak++;
    else break;
  }

  return streak;
}

/* ---------------- MAIN HOOK ---------------- */

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

    /* ---------- CACHE ---------- */
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

    /* ---------- FETCH PER YEAR ---------- */

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
        json?.data?.user?.contributionsCollection?.contributionCalendar
          ?.weeks || [];

      return weeks.flatMap((w: any) => w.contributionDays);
    }

    /* ---------- MAIN ---------- */

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const CURRENT_YEAR = new Date().getFullYear();
        const START_YEAR = 2020; // safe for most users

        const allDays: ContributionDay[] = [];

        for (let year = START_YEAR; year <= CURRENT_YEAR; year++) {
          const days = await fetchYear(year);
          allDays.push(...days);
        }

        if (!allDays.length) {
          throw new Error("No contribution data found");
        }

        /* ---------- SORT DAYS ---------- */
        const orderedDays = [...allDays].sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        /* ---------- MAP DATE -> COUNT ---------- */
        const map = new Map<string, number>();
        orderedDays.forEach((d) => {
          map.set(d.date, d.contributionCount);
        });

        /* ---------- FULL HISTORY SERIES ---------- */
        const fullSeries = orderedDays.map((d) => d.contributionCount);

        /* ---------- TOTAL COMMITS ---------- */
        const total = fullSeries.reduce((a, b) => a + b, 0);

        /* ---------- LONGEST STREAK ---------- */
        const longest = getLongestStreak(fullSeries);

        /* ---------- CURRENT STREAK (SAFE) ---------- */
        const current = getSmartCurrentStreakFull(fullSeries);

        /* ---------- BUILD LAST 90 DAYS HEATMAP ---------- */
        const heat: number[] = [];
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        for (let i = 89; i >= 0; i--) {
          const d = new Date(today);
          d.setUTCDate(today.getUTCDate() - i);
          const key = d.toISOString().slice(0, 10);
          heat.push(map.get(key) || 0);
        }

        /* ---------- CACHE ---------- */
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
