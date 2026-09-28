"use server";

import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const mockData = {
  support_ticket: [
    {
      title: "Login issue on Android app",
      description: "User unable to login via Google OAuth",
      channel: "Support Ticket",
    },
    {
      title: "Payment failed during checkout",
      description: "Card charged but order not placed",
      channel: "Support Ticket",
    },
  ],
  app_review: [
    {
      title: "Great application",
      description: "Smooth UI and fast load times!",
      channel: "App Review",
    },
    {
      title: "App crashes frequently",
      description: "Crashes on startup on iOS 17",
      channel: "App Review",
    },
  ],
  nps_response: [
    {
      title: "Score 10/10",
      description: "Excellent service and quick support response",
      channel: "NPS Response",
    },
    {
      title: "Score 6/10",
      description: "Needs improvement in dashboard UI",
      channel: "NPS Response",
    },
  ],
};

export async function importSimulatedData(
  workspaceId: string,
  channelType: "support_ticket" | "app_review" | "nps_response"
) {
  try {
    let userId = await getSessionUserId();

    if (!userId) {
      const existingUser = await db.user.findFirst();
      userId = existingUser?.id || null;
    }

    if (!userId) {
      return {
        success: false,
        error: "No user found in database.",
      };
    }

    const itemsToInsert = mockData[channelType];

    for (const item of itemsToInsert) {
      // Find or create the channel for this workspace
      let channel = await db.channel.findFirst({
        where: {
          name: item.channel,
          workspaceId,
        },
      });

      if (!channel) {
        channel = await db.channel.create({
          data: {
            name: item.channel,
            workspaceId,
          },
        });
      }

      // Create feedback using the current Prisma schema
      await db.feedback.create({
        data: {
          content: `${item.title} - ${item.description}`,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          channel: {
            connect: {
              id: channel.id,
            },
          },
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    revalidatePath("/[slug]", "layout");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Simulation error:", error);

    return {
      success: false,
      error: error?.message || "Failed to import simulated data",
    };
  }
}