import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const content = body.content || body.text || body.description;
    const workspaceId = body.workspaceId || body.workspace_id;

    if (!content || !workspaceId) {
      return NextResponse.json(
        { error: "Content and workspaceId are required" },
        { status: 400 }
      );
    }

    const newFeedback = await db.feedback.create({
      data: {
        title: String(content).slice(0, 30),
        description: String(content),
        workspaceId: String(workspaceId),
      },
    });

    // Valid JSON object return kar rahe hain
    return NextResponse.json({ success: true, feedback: newFeedback }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}