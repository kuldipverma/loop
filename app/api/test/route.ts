import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const newWorkspace = await db.workspace.create({
      data: {
        name: 'Test Workspace',
      },
    })
    return NextResponse.json({ success: true, data: newWorkspace })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
} 
