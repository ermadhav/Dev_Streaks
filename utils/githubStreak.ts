// // utils/githubStreak.ts

// type ContributionDay = {
//   date: string;
//   contributionCount: number;
// };

// type Week = {
//   contributionDays: ContributionDay[];
// };

// export function getGithubLongestStreak(weeks: Week[]) {
//   let longest = 0;
//   let current = 0;

//   for (const week of weeks) {
//     for (const day of week.contributionDays) {
//       if (day.contributionCount > 0) {
//         current++;
//         longest = Math.max(longest, current);
//       } else {
//         current = 0;
//       }
//     }
//   }

//   return longest;
// }

// export function getGithubCurrentStreak(weeks: Week[]) {
//   let streak = 0;

//   // iterate backwards (latest day first)
//   for (let w = weeks.length - 1; w >= 0; w--) {
//     const days = weeks[w].contributionDays;
//     for (let d = days.length - 1; d >= 0; d--) {
//       if (days[d].contributionCount > 0) {
//         streak++;
//       } else {
//         return streak;
//       }
//     }
//   }

//   return streak;
// }
