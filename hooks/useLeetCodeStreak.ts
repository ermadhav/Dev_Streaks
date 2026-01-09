import { useEffect, useState } from "react";

type SolvedStats = {
  easy: number;
  medium: number;
  hard: number;
  total: number;
};

type LeetCodeCache = {
  username: string;
  currentStreak: number;
  longestStreak: number;
  heatmap: number[];
  solved: SolvedStats;
  timestamp: number;
};

let leetCodeCache: LeetCodeCache | null = null;
const CACHE_TTL = 1000 * 60 * 10; //  10 minutes

export function useLeetCodeStreak(username: string) {
  const cleanUsername = username.trim();

  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [heatmap, setHeatmap] = useState<number[]>([]);
  const [solved, setSolved] = useState<SolvedStats>({
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cleanUsername) {
      setLoading(false);
      return;
    }

    //  Use cache if valid
    if (
      leetCodeCache &&
      leetCodeCache.username === cleanUsername &&
      Date.now() - leetCodeCache.timestamp < CACHE_TTL
    ) {
      setCurrentStreak(leetCodeCache.currentStreak);
      setLongestStreak(leetCodeCache.longestStreak);
      setHeatmap(leetCodeCache.heatmap);
      setSolved(leetCodeCache.solved);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                matchedUser(username: "${cleanUsername}") {
                  submissionCalendar
                  submitStats {
                    acSubmissionNum {
                      difficulty
                      count
                    }
                  }
                }
              }
            `,
          }),
        });

        const json = await res.json();

        if (!json?.data?.matchedUser) {
          throw new Error("LeetCode user not found");
        }

        /* ---------- SOLVED STATS ---------- */
        const stats =
          json.data.matchedUser.submitStats.acSubmissionNum;

        const solvedMap: SolvedStats = {
          easy: 0,
          medium: 0,
          hard: 0,
          total: 0,
        };

        stats.forEach((s: any) => {
          if (s.difficulty === "Easy") solvedMap.easy = s.count;
          if (s.difficulty === "Medium") solvedMap.medium = s.count;
          if (s.difficulty === "Hard") solvedMap.hard = s.count;
          if (s.difficulty === "All") solvedMap.total = s.count;
        });

        setSolved(solvedMap);

        /* ---------- CALENDAR ---------- */
        const calendar = JSON.parse(
          json.data.matchedUser.submissionCalendar
        );

        const timestamps = Object.keys(calendar)
          .map(Number)
          .sort((a, b) => a - b);

        /* ---------- LONGEST STREAK ---------- */
        let longest = 0;
        let current = 0;
        let prevDay = -1;

        timestamps.forEach((ts) => {
          const day = Math.floor(ts / 86400);
          if (prevDay === -1 || day !== prevDay + 1) {
            current = 1;
          } else {
            current++;
          }
          longest = Math.max(longest, current);
          prevDay = day;
        });

        setLongestStreak(longest);

        /* ---------- CURRENT STREAK ---------- */
        let streak = 0;

        //  Start from yesterday (avoid showing 0 during the day)
        let dayCursor =
          Math.floor(Date.now() / 1000 / 86400) - 1;

        while (calendar[dayCursor * 86400]) {
          streak++;
          dayCursor--;
        }

        setCurrentStreak(streak);

        /* ---------- HEATMAP (LAST 90 DAYS) ---------- */
        const map = new Map<string, number>();

        Object.keys(calendar).forEach((ts) => {
          const date = new Date(Number(ts) * 1000)
            .toISOString()
            .slice(0, 10);
          map.set(date, calendar[ts]);
        });

        const heat: number[] = [];
        const todayDate = new Date();
        todayDate.setUTCHours(0, 0, 0, 0);

        for (let i = 89; i >= 0; i--) {
          const d = new Date(todayDate);
          d.setUTCDate(todayDate.getUTCDate() - i);
          const key = d.toISOString().slice(0, 10);
          heat.push(map.get(key) || 0);
        }

        setHeatmap(heat);

        //  Save to cache
        leetCodeCache = {
          username: cleanUsername,
          currentStreak: streak,
          longestStreak: longest,
          heatmap: heat,
          solved: solvedMap,
          timestamp: Date.now(),
        };
      } catch (err: any) {
        console.error("LeetCode streak error:", err.message);
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
    solved,
    heatmap,
    loading,
    error,
  };
}
