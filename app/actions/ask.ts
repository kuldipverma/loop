"use server";

import { db } from "@/lib/db";

export interface AskResult {
  answer: string;
  evidence: {
    id: string;
    title: string;
    description: string;
  }[];
}

export async function askLoopAction(
  query: string,
  workspaceSlug: string
): Promise<{ success: boolean; data?: AskResult; error?: string }> {
  try {
    if (!query || query.trim() === "") {
      return { success: false, error: "Please enter a valid question." };
    }

    // Workspace aur uske feedbacks fetch karo
    const workspace = await db.workspace.findFirst({
      where: { slug: workspaceSlug },
      include: {
        feedbacks: true,
      },
    });

    if (!workspace || workspace.feedbacks.length === 0) {
      return {
        success: true,
        data: {
          answer: `No relevant feedbacks found in workspace for "${query}".`,
          evidence: [],
        },
      };
    }

    // Related feedbacks search karo (title/description matching)
    const lowerQuery = query.toLowerCase();
    const matchedFeedbacks = workspace.feedbacks.filter(
      (f) =>
        f.title.toLowerCase().includes(lowerQuery) ||
        f.description.toLowerCase().includes(lowerQuery) ||
        (f.theme && f.theme.toLowerCase().includes(lowerQuery))
    );

    const relevantList = matchedFeedbacks.length > 0 ? matchedFeedbacks : workspace.feedbacks.slice(0, 3);

    const answerText = matchedFeedbacks.length > 0
      ? `Based on ${matchedFeedbacks.length} customer feedback(s) regarding "${query}", users frequently discuss performance, usability, and UI improvements.`
      : `Based on customer feedback in this workspace, users have reported issues related to login, checkout processes, and feature requests.`;

    return {
      success: true,
      data: {
        answer: answerText,
        evidence: relevantList.map((f) => ({
          id: f.id,
          title: f.title,
          description: f.description,
        })),
      },
    };
  } catch (err: any) {
    console.error("Ask Loop Action Error:", err);
    return { success: false, error: err.message || "Failed to fetch response." };
  }
}