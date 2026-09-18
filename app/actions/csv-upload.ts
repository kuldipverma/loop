"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function processCSVRowsAction({
  rows,
  workspaceId,
  slug,
}: {
  rows: any[];
  workspaceId: string;
  slug: string;
}) {
  let userId = await getSessionUserId();

  let success = 0;
  let failed = 0;

  for (const row of rows) {
    // CSV file ke alag-alag possible headers handle kar rahe hain
    const content = row.content || row.title || row.Feedback || row.description || "";

    if (!content || content.trim() === "") {
      failed++;
      continue;
    }

    try {
      await db.feedback.create({
        data: {
          title: content,
          description: content,
          channel: row.channel || "CSV Import",
          customerLabel: row.customer_label || row.customerLabel || null,
          workspaceId: workspaceId,
          ...(userId ? { userId: userId } : {}),
        },
      });
      success++;
    } catch (err) {
      console.error("Row Insert Failed:", err);
      failed++;
    }
  }

  revalidatePath(`/${slug}`);
  return { success, failed };
}