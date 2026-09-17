"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { hasPermission, Role } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createFeedbackAction(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  const workspaceId = formData.get("workspaceId") as string;
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // Check user & workspace permissions
  const user = await db.user.findFirst({
    where: { id: userId, organizationId: workspaceId },
  });

  if (!user || !hasPermission(user.role as Role, "canAddFeedback")) {
    throw new Error("Access Denied: VIEWER role wale feedback create nahi kar sakte!");
  }

  await db.feedback.create({
    data: { title, description, workspaceId, userId: user.id },
  });

  revalidatePath(`/${slug}`);
}

export async function deleteFeedbackAction(formData: FormData) {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  const feedbackId = formData.get("feedbackId") as string;
  const slug = formData.get("slug") as string;

  const feedback = await db.feedback.findUnique({
    where: { id: feedbackId },
  });

  if (!feedback) throw new Error("Feedback not found");

  const user = await db.user.findFirst({
    where: { id: userId, organizationId: feedback.workspaceId },
  });

  if (!user || (!hasPermission(user.role as Role, "canManageMembers") && feedback.userId !== user.id)) {
    throw new Error("Access Denied: Aapke paas delete karne ki permission nahi hai!");
  }

  await db.feedback.delete({
    where: { id: feedbackId },
  });

  revalidatePath(`/${slug}`);
}