"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
      customerLabel,
      workspaceId,
      createdById: userId,
    },
  });

  revalidatePath(`/${slug}`);
}