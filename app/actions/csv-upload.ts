"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { hasPermission, Role } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function uploadCSVAction(formData: FormData) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return { error: "Unauthorized" };

    const workspaceId = formData.get("workspaceId") as string;
    const slug = formData.get("slug") as string;
    const file = formData.get("file") as File;

    if (!file || !workspaceId) {
      return { error: "File and workspace ID are required" };
    }

    // Role Check (Sirf ADMIN aur ANALYST CSV upload kar sakte hain)
    const user = await db.user.findFirst({
      where: { id: userId, organizationId: workspaceId },
    });

    if (!user || !hasPermission(user.role as Role, "canAddFeedback")) {
      return { error: "Access Denied: Is action ke liye permission nahi hai." };
    }

    // Parse CSV Text
    const text = await file.text();
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

    // Skip Header row if exists (title, description / feedback)
    const dataLines = lines[0].toLowerCase().includes("title") ? lines.slice(1) : lines;

    const feedbacksToInsert = dataLines.map((line) => {
      const parts = line.split(",");
      const title = parts[0]?.replace(/^"|"$/g, "").trim() || "CSV Feedback";
      const description = parts[1]?.replace(/^"|"$/g, "").trim() || parts[0] || "";
      
      return {
        title,
        description,
        workspaceId,
        userId: user.id,
      };
    });

    if (feedbacksToInsert.length > 0) {
      await db.feedback.createMany({
        data: feedbacksToInsert,
      });
    }

    revalidatePath(`/${slug}`);
    return { success: true, count: feedbacksToInsert.length };
  } catch (error: any) {
    return { error: error.message || "Failed to process CSV file" };
  }
}