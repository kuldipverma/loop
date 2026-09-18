"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// 1. Single Feedback Creation
export async function createFeedbackAction(formData: FormData) {
  const content = formData.get("content") as string;
  const channel = formData.get("channel") as string;
  const customerLabel = formData.get("customerLabel") as string;
  const workspaceId = formData.get("workspaceId") as string;
  const slug = formData.get("slug") as string;

  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.feedback.create({
    data: {
      content,
      channel,
      customerLabel: customerLabel || null,
      workspaceId,
      createdById: userId,
    },
  });

  revalidatePath(`/${slug}`);
}

// 2. Delete Feedback Action
export async function deleteFeedbackAction(formData: FormData) {
  const feedbackId = formData.get("feedbackId") as string;
  const slug = formData.get("slug") as string;

  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.feedback.delete({
    where: { id: feedbackId },
  });

  revalidatePath(`/${slug}`);
}

// 3. DAY 6: CSV Bulk Upload Action
export async function uploadCSVFeedbacksAction(
  feedbacks: Array<{ content: string; channel: string; customer_label?: string; created_at?: string }>,
  workspaceId: string,
  userId: string,
  slug: string
) {
  let successCount = 0;
  let failureCount = 0;

  const validChannels = ["Support Ticket", "App Store", "NPS Survey", "Sales Call", "Community"];

  for (const item of feedbacks) {
    if (!item.content || !item.channel || !validChannels.includes(item.channel)) {
      failureCount++;
      continue;
    }

    try {
      await db.feedback.create({
        data: {
          content: item.content,
          channel: item.channel,
          customerLabel: item.customer_label || null,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          workspaceId: workspaceId,
          createdById: userId,
        },
      });
      successCount++;
    } catch {
      failureCount++;
    }
  }

  revalidatePath(`/${slug}`);
  return { successCount, failureCount };
}