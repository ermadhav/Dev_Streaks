export function calculateHealthScore(data: number[]) {
  const last30 = data.slice(-30);
  const last7 = data.slice(-7);
  const prev7 = data.slice(-14, -7);

  const activeDays30 = last30.filter((d) => d > 0).length;
  const activeDays7 = last7.filter((d) => d > 0).length;
  const activeDaysPrev7 = prev7.filter((d) => d > 0).length;

  /* ---------- CONSISTENCY (50) ---------- */
  const consistencyScore = Math.round(
    (activeDays30 / 30) * 50
  );

  /* ---------- TREND (30) ---------- */
  let trendScore = 15; // neutral
  if (activeDays7 > activeDaysPrev7) trendScore = 30;
  else if (activeDays7 < activeDaysPrev7) trendScore = 5;

  /* ---------- GAPS (20) ---------- */
  let longestGap = 0;
  let currentGap = 0;

  last30.forEach((d) => {
    if (d === 0) {
      currentGap++;
      longestGap = Math.max(longestGap, currentGap);
    } else {
      currentGap = 0;
    }
  });

  const gapPenalty = Math.min(longestGap * 4, 20);
  const gapScore = 20 - gapPenalty;

  const total = Math.max(
    0,
    Math.min(100, consistencyScore + trendScore + gapScore)
  );

  return {
    score: total,
    breakdown: {
      consistency: consistencyScore,
      trend: trendScore,
      gaps: gapScore,
    },
    explanation: generateExplanation({
      consistency: consistencyScore,
      trend: trendScore,
      gap: gapScore,
    }),
  };
}

/* ---------- EXPLANATION ENGINE ---------- */
function generateExplanation({
  consistency,
  trend,
  gap,
}: {
  consistency: number;
  trend: number;
  gap: number;
}) {
  const parts: string[] = [];

  if (consistency >= 35)
    parts.push("you stayed consistent most days");
  else if (consistency >= 20)
    parts.push("your activity was moderate");
  else parts.push("your consistency was low");

  if (trend >= 25)
    parts.push("you improved compared to last week");
  else if (trend <= 10)
    parts.push("your activity dropped recently");

  if (gap >= 15)
    parts.push("with very few long breaks");
  else if (gap <= 8)
    parts.push("but long breaks hurt your momentum");

  return `Your score is based on how often you stayed active, recent momentum, and gaps. Overall, ${parts.join(
    ", "
  )}.`;
}
