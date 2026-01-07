// utils/leetcodeStreak.ts

const DAY = 86400;

/* ---------------- LONGEST STREAK ---------------- */

export function getLeetCodeLongestStreak(
  calendar: Record<string, number>
) {
  const days = Object.keys(calendar)
    .map((ts) => Math.floor(Number(ts) / DAY))
    .sort((a, b) => a - b);

  if (days.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      current++;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}

/* ---------------- CURRENT STREAK ---------------- */

export function getLeetCodeCurrentStreak(
  calendar: Record<string, number>
) {
  if (!calendar || Object.keys(calendar).length === 0) return 0;

  // Convert timestamps → unique day numbers
  const solvedDays = new Set<number>(
    Object.keys(calendar).map((ts) =>
      Math.floor(Number(ts) / DAY)
    )
  );

  // Find the latest solved day
  const latestDay = Math.max(...solvedDays);

  let streak = 0;
  let cursor = latestDay;

  // Walk backwards while days exist
  while (solvedDays.has(cursor)) {
    streak++;
    cursor--;
  }

  return streak;
}
