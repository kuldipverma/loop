import { db } from "@/lib/db";

export async function getTrendsData(slug: string) {
  // Current date ranges setup (Last 7 days vs Previous 7 days)
  const now = new Date();
  const currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const feedbacks = await db.feedback.findMany({
    where: { createdAt: { gte: previousStart } },
    select: {
      id: true,
      theme: true,
      createdAt: true,
    },
  });

  const themeStats: Record<string, { current: number; previous: number }> = {};

  feedbacks.forEach((item) => {
    const themeName = item.theme || "General";
    if (!themeStats[themeName]) {
      themeStats[themeName] = { current: 0, previous: 0 };
    }

    if (new Date(item.createdAt) >= currentStart) {
      themeStats[themeName].current += 1;
    } else {
      themeStats[themeName].previous += 1;
    }
  });

  // Calculate percentage growth & spikes
  return Object.entries(themeStats).map(([theme, counts]) => {
    const prev = counts.previous;
    const curr = counts.current;

    let growth = 0;
    if (prev > 0) {
      growth = Math.round(((curr - prev) / prev) * 100);
    } else if (curr > 0) {
      growth = 100;
    }

    const isSpike = growth >= 50 && curr >= 3; // 50%+ growth & 3+ count

    return {
      theme,
      previous: prev,
      current: curr,
      growth,
      isSpike,
    };
  });
}