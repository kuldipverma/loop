import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper function to resolve current workspace
async function getSessionWorkspaceId(req: Request) {
  const workspaceId = req.headers.get('x-workspace-id')
  if (!workspaceId) {
    const defaultWorkspace = await db.workspace.findFirst()
    return defaultWorkspace?.id || null
  }
  return workspaceId
}

// GET: Fetch all feedbacks for active workspace
export async function GET(request: Request) {
  try {
    const workspaceId = await getSessionWorkspaceId(request)

    if (!workspaceId) {
      return NextResponse.json({ error: 'Unauthorized: No Workspace Selected' }, { status: 401 })
    }

    // Security Rule Enforced (Without unsupported createdAt sort)
    const feedbacks = await db.feedback.findMany({
      where: {
        workspaceId: workspaceId,
      },
    })

    return NextResponse.json({ success: true, data: feedbacks })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

// POST: Save new feedback linked to workspace
export async function POST(request: Request) {
  try {
    let workspaceId = await getSessionWorkspaceId(request)

    if (!workspaceId) {
      const newWs = await db.workspace.create({
        data: { name: 'Default Workspace' },
      })
      workspaceId = newWs.id
    }

    const body = await request.json()

    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const newFeedback = await db.feedback.create({
      data: {
        content: body.content,
        workspaceId: workspaceId,
      },
    })

    return NextResponse.json({ success: true, data: newFeedback })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}