"use server";

import { db } from "@/lib/db";
import { classifyFeedbackText } from "@/lib/ai-classifier";
import { revalidatePath } from "next/cache";

export async function reclassifyFeedbackAction(feedbackId: string, slug: string) {
  try {
    const feedback = await db.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) return { error: "Feedback not found" };

    // Run AI classification
    const result = await classifyFeedbackText(feedback.title, feedback.description || "");

    // Store in PostgreSQL database
    await db.feedback.update({
      where: { id: feedbackId },
      data: {
        sentiment: result.sentiment,
        sentimentScore: result.sentimentScore,
        themes: result.themes,
        featureArea: result.featureArea,
        rationale: result.rationale,
      },
    });

    if (slug) revalidatePath(`/${slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Classification error:", error);
    return { error: error.message || "Failed to classify feedback" };
  }
}