
const SECONDS_IN_DAY = 86400;

/**
 * Convert timestamp (seconds) 
 */
function toDay(ts: number) {
  return Math.floor(ts / SECONDS_IN_DAY);
}

/**
 * Longest streak is already mostly correct
 */
export function getLeetCodeLongestStreak(
  calendar: Record<string, number>
) {
  const days = Object.keys(calendar)
    .map(Number)
    .map(toDay)
    .sort((a, b) => a - b);

  let longest = 0;
  let current = 0;
  let prevDay: number | null = null;

  for (const day of days) {
    if (prevDay === null || day !== prevDay + 1) {
      current = 1;
    } else {
      current++;
    }

    longest = Math.max(longest, current);
    prevDay = day;
  }

  return longest;
}


export function getLeetCodeCurrentStreak(
  calendar: Record<string, number>
) {
  const daySet = new Set(
    Object.keys(calendar).map((ts) => toDay(Number(ts)))
  );

  // Today in UTC days
  const todayDay = Math.floor(Date.now() / 1000 / SECONDS_IN_DAY);

  // Start from yesterday (ignore today)
  let checkDay = todayDay - 1;
  let streak = 0;

  while (daySet.has(checkDay)) {
    streak++;
    checkDay--;
  }

  return streak;
}
