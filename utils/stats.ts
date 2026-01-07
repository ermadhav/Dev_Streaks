// utils/stats.ts

// ---------- BASIC SUMMARIES ----------

export function getWeeklySummary(data: number[]) {
  const last7 = data.slice(-7);
  return {
    activeDays: last7.filter((d) => d > 0).length,
    total: last7.reduce((a, b) => a + b, 0),
  };
}

export function getMonthlySummary(data: number[]) {
  const last30 = data.slice(-30);
  return {
    activeDays: last30.filter((d) => d > 0).length,
    total: last30.reduce((a, b) => a + b, 0),
  };
}

// ---------- STREAK LOGIC (CORRECT & SAFE) ----------

// 🏆 Longest streak ever
export function getLongestStreak(data: number[]) {
  let longest = 0;
  let current = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

// 🔥 Current streak (up to today)
export function getCurrentStreak(data: number[]) {
  let streak = 0;

  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] > 0) streak++;
    else break;
  }

  return streak;
}

// ---------- COMPARISON ----------

export function getComparison(
  current: number[],
  previous: number[]
) {
  const currActive = current.filter((d) => d > 0).length;
  const prevActive = previous.filter((d) => d > 0).length;

  if (prevActive === 0) return 100;
  return Math.round(((currActive - prevActive) / prevActive) * 100);
}

// ---------- LAST ACTIVE DAY ----------

export function getLastActiveDay(data: number[]) {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] > 0) {
      const diff = data.length - 1 - i;
      return diff === 0 ? "Today" : `${diff} days ago`;
    }
  }
  return "Never";
}

// ---------- STREAK HEALTH SCORE ----------

export function getHealthScore(data: number[]) {
  const last30 = data.slice(-30);
  const activeDays = last30.filter((d) => d > 0).length;

  const longest = getLongestStreak(data);
  const current = getCurrentStreak(data);

  const score =
    (activeDays / 30) * 60 +
    (current / Math.max(longest, 1)) * 40;

  return Math.min(100, Math.round(score));
}
