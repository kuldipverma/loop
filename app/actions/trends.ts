"use server";

import { db } from "@/lib/db";

export async function getTrendsDataAction(slug: string) {
  try {
    const workspace = await db.workspace.findUnique({
      where: { slug },
    });

    if (!workspace) {
      return { success: false, error: "Workspace not found" };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Current Period (Last 7 Days)
    const currentFeedbacks = await db.feedback.findMany({
      where: {
        workspaceId: workspace.id,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    // Previous Period (7-14 Days ago)
    const previousFeedbacks = await db.feedback.findMany({
      where: {
        workspaceId: workspace.id,
        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
      },
    });

    // Count theme volume for current period
    const currentThemeMap: Record<string, number> = {};
    currentFeedbacks.forEach((f) => {
      const theme = f.theme || "General";
      currentThemeMap[theme] = (currentThemeMap[theme] || 0) + 1;
    });

    // Count theme volume for previous period
    const previousThemeMap: Record<string, number> = {};
    previousFeedbacks.forEach((f) => {
      const theme = f.theme || "General";
      previousThemeMap[theme] = (previousThemeMap[theme] || 0) + 1;
    });

    // Combine and calculate growth
    const allThemes = Array.from(
      new Set([...Object.keys(currentThemeMap), ...Object.keys(previousThemeMap)])
    );

    const trends = allThemes.map((theme) => {
      const current = currentThemeMap[theme] || 0;
      const previous = previousThemeMap[theme] || 0;

      let growthPercentage = 0;
      if (previous === 0) {
        growthPercentage = current > 0 ? 100 : 0;
      } else {
        growthPercentage = Math.round(((current - previous) / previous) * 100);
      }

      const isSpike = growthPercentage >= 50 && current >= 3;

      return {
        theme,
        current,
        previous,
        growthPercentage,
        isSpike,
      };
    });

    // Sort by highest volume
    trends.sort((a, b) => b.current - a.current);

    return { success: true, trends };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}