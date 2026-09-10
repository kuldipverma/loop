import { db } from '@/lib/db'

// Temporary auth helper testing ke liye
// Production me ye NextAuth / Clerk session se workspaceId uthayega
export async function getSessionWorkspaceId(req: Request) {
  const workspaceId = req.headers.get('x-workspace-id')
  
  if (!workspaceId) {
    // Default fallback agar header me ID na mile
    const defaultWorkspace = await db.workspace.findFirst()
    return defaultWorkspace?.id || null
  }
  
  return workspaceId
}