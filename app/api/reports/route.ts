 import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function getSessionWorkspaceId(req: Request) {
  const workspaceId = req.headers.get('x-workspace-id')
  if (!workspaceId) {
    const defaultWorkspace = await db.workspace.findFirst()
    return defaultWorkspace?.id || null
  }
  return workspaceId
}

export async function GET(request: Request) {
  try {
    const workspaceId = await getSessionWorkspaceId(request)

    if (!workspaceId) {
      return NextResponse.json({ error: 'Unauthorized: No Workspace Selected' }, { status: 401 })
    }

    // Security Rule: Strict workspace isolation
    const reports = await db.report.findMany({
      where: {
        workspaceId: workspaceId,
      },
    })

    return NextResponse.json({ success: true, data: reports })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
