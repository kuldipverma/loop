"use server";

import { db } from "@/lib/db";
import { analyzeFeedbackWithClaude } from "@/lib/ai";
import { revalidatePath } from "next/cache";

export async function processBatchAnalysisAction(workspaceId: string, slug: string) {
  try {
    const unanalyzedFeedbacks = await db.feedback.findMany({
      where: {
        workspaceId: workspaceId,
        OR: [
          { sentiment: null },
          { theme: null }
        ]
      },
      take: 10
    });

    if (unanalyzedFeedbacks.length === 0) {
      return { success: true, count: 0, message: "Sabhi feedbacks pehle se analyzed hain!" };
    }

    let processedCount = 0;

    for (const item of unanalyzedFeedbacks) {
      try {
        const textToAnalyze = item.description || item.title;
        const result = await analyzeFeedbackWithClaude(textToAnalyze);

        await db.feedback.update({
          where: { id: item.id },
          data: {
            sentiment: result.sentiment,
            theme: result.theme,
          }
        });

        processedCount++;
      } catch (err) {
        console.error(`Error on item ${item.id}:`, err);
      }
    }

    revalidatePath(`/${slug}`);
    return { success: true, count: processedCount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}