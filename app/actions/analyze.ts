"use server";

import { db } from "@/lib/db";
import { analyzeFeedbackWithClaude } from "@/lib/ai";
import { revalidatePath } from "next/cache";

export async function analyzeFeedbackAction(feedbackId: string, slug?: string) {
  try {
    const feedback = await db.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return { success: false, error: "Feedback record not found." };
    }

    // Call Claude / Mock AI function
    const aiResult = await analyzeFeedbackWithClaude(feedback.description || feedback.title);

    // Update DB record with safe payload
    await db.feedback.update({
      where: { id: feedbackId },
      data: {
        sentiment: aiResult.sentiment,
        theme: aiResult.theme,
      },
    });

    revalidatePath("/inbox");
    return { success: true };
  } catch (err: any) {
    console.error("Analysis Action Error:", err);
    return { success: false, error: err?.message || "Failed to analyze feedback." };
  }
}