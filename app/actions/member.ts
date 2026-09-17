"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { hasPermission, Role } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function updateMemberRoleAction(formData: FormData) {
  const currentUserId = await getSessionUserId();
  if (!currentUserId) throw new Error("Unauthorized");

  const targetUserId = formData.get("targetUserId") as string;
  const newRole = formData.get("role") as Role;
  const workspaceId = formData.get("workspaceId") as string;
  const slug = formData.get("slug") as string;

  const currentUser = await db.user.findFirst({
    where: { id: currentUserId, organizationId: workspaceId },
  });

  if (!currentUser || !hasPermission(currentUser.role as Role, "canChangeRoles")) {
    throw new Error("Access Denied: Sirf ADMIN hi member roles badal sakta hai!");
  }

  await db.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  revalidatePath(`/${slug}`);
}