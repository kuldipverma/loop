import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const workspaces = await db.workspace.findMany();
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Workspace API error:", error);
    return NextResponse.json([]);
  }
}