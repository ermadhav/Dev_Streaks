// utils/leetcodeStreak.ts

export function getLeetCodeLongestStreak(
  calendar: Record<string, number>
) {
  const days = Object.keys(calendar)
    .map(Number)
    .sort((a, b) => a - b);

  let longest = 0;
  let current = 0;
  let prevDay = -1;

  for (const ts of days) {
    const day = Math.floor(ts / 86400); // UTC day

    if (prevDay === -1 || day !== prevDay + 1) {
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
  const days = Object.keys(calendar)
    .map(Number)
    .sort((a, b) => b - a);

  let streak = 0;
  let prevDay = -1;

  for (const ts of days) {
    const day = Math.floor(ts / 86400);

    if (prevDay === -1 || day === prevDay - 1) {
      streak++;
    } else {
      break;
    }

    prevDay = day;
  }

  return streak;
}
