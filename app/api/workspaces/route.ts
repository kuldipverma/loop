import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Fetch all available workspaces
export async function GET() {
  try {
    const workspaces = await db.workspace.findMany()
    return NextResponse.json({ success: true, data: workspaces })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

// POST: Create a new workspace
export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 })
    }

    const newWorkspace = await db.workspace.create({
      data: { name: body.name },
    })

    return NextResponse.json({ success: true, data: newWorkspace })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}