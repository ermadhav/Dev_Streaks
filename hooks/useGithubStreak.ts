import { useEffect, useState } from "react";
import { getCurrentStreak, getLongestStreak } from "../utils/stats";

/**
 * ENV REQUIRED:
 * EXPO_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */

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
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

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

    // ✅ Cache
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

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query ($username: String!) {
                user(login: $username) {
                  contributionsCollection {
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
            variables: { username: cleanUsername },
          }),
        });

        const json = await res.json();

        if (json.errors?.length) {
          throw new Error(json.errors[0].message);
        }

        const weeks =
          json?.data?.user?.contributionsCollection?.contributionCalendar
            ?.weeks;

        if (!weeks?.length) {
          throw new Error("No contribution data found");
        }

        const days: ContributionDay[] = weeks.flatMap(
          (w: any) => w.contributionDays
        );

        // ---------- Build date → commits map ----------
        const map = new Map<string, number>();
        days.forEach((d) => map.set(d.date, d.contributionCount));

        // ---------- Total commits ----------
        const total = days.reduce((sum, d) => sum + d.contributionCount, 0);

        // ---------- Build last 90 days heatmap ----------
        const heat: number[] = [];
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        for (let i = 89; i >= 0; i--) {
          const d = new Date(today);
          d.setUTCDate(today.getUTCDate() - i);
          const key = d.toISOString().slice(0, 10);
          heat.push(map.get(key) || 0);
        }

        // ---------- Streaks from heatmap ----------
        const streak = getCurrentStreak(heat);
        const longest = getLongestStreak(heat);

        // ---------- Cache ----------
        githubCache = {
          username: cleanUsername,
          currentStreak: streak,
          longestStreak: longest,
          totalCommits: total,
          heatmap: heat,
          timestamp: Date.now(),
        };

        setCurrentStreak(streak);
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
