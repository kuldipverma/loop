"use server";

import { db } from "@/lib/db";

export interface ThemeCluster {
  theme: string;
  description: string;
  count: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  feedbacks: Array<{
    id: string;
    title: string;
    description: string | null;
    sentiment: string | null;
    createdAt: Date;
  }>;
}

export async function getThemeClusters(workspaceId: string): Promise<ThemeCluster[]> {
  try {
    const feedbacks = await db.feedback.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const themeDescriptions: Record<string, string> = {
      Onboarding: "Issues and suggestions related to user sign-up and initial workflow.",
      Billing: "Feedback regarding pricing plans, invoices, and checkout failures.",
      Performance: "Reports on slow loading times, latency, or application lag.",
      "Mobile Experience": "User interface and responsiveness complaints on mobile devices.",
      Dashboard: "Ideas and bugs regarding data visualization and dashboard analytics.",
      Authentication: "Login, OAuth, and password recovery related feedback.",
      Export: "Data export, CSV download, and report generation requests.",
    };

    const clustersMap: Record<string, ThemeCluster> = {};

    for (const item of feedbacks) {
      const themeName = item.channel || "General";

      if (!clustersMap[themeName]) {
        clustersMap[themeName] = {
          theme: themeName,
          description: themeDescriptions[themeName] || `All feedback collected regarding ${themeName}.`,
          count: 0,
          sentiment: "Neutral",
          feedbacks: [],
        };
      }

      clustersMap[themeName].count += 1;
      clustersMap[themeName].feedbacks.push({
        id: item.id,
        title: item.title,
        description: item.description,
        sentiment: item.sentiment,
        createdAt: item.createdAt,
      });
    }

    const result = Object.values(clustersMap).map((cluster) => {
      let pos = 0, neg = 0;
      cluster.feedbacks.forEach((f) => {
        if (f.sentiment?.toLowerCase() === "positive") pos++;
        if (f.sentiment?.toLowerCase() === "negative") neg++;
      });

      if (pos > neg) cluster.sentiment = "Positive";
      else if (neg > pos) cluster.sentiment = "Negative";
      else cluster.sentiment = "Neutral";

      return cluster;
    });

    return result;
  } catch (error) {
    console.error("Error fetching theme clusters:", error);
    return [];
  }
}