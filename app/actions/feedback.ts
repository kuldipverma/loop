"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createFeedbackAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const channel = (formData.get("channel") as string) || "Support Ticket";
  const customerLabel = formData.get("customerLabel") as string;
  const workspaceId = formData.get("workspaceId") as string;
  const slug = formData.get("slug") as string;

  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.feedback.create({
    data: {
      title,
      description,
      channel,
      customerLabel: customerLabel || null,
      status: "NEW",
      workspaceId,
      userId,
    },
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/inbox");
}

export async function updateFeedbackStatusAction(feedbackId: string, newStatus: string) {
  await db.feedback.update({
    where: { id: feedbackId },
    data: { status: newStatus },
  });

  revalidatePath("/inbox");
}