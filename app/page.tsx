'use client'

import { useState, useEffect } from 'react'

interface Feedback {
  id: string
  content: string
}

interface Workspace {
  id: string
  name: string
}

export default function Home() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [content, setContent] = useState('')
  const [newWsName, setNewWsName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // 1. Fetch Workspaces
  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces')
      const result = await res.json()
      if (result.success && result.data.length > 0) {
        setWorkspaces(result.data)
        if (!activeWorkspaceId) {
          setActiveWorkspaceId(result.data[0].id)
        }
      }
    } catch (err) {
      setErrorMsg('Failed to load workspaces')
    }
  }

  // 2. Fetch Feedbacks for Selected Workspace
  const fetchFeedbacks = async (wsId: string) => {
    if (!wsId) return
    try {
      const res = await fetch('/api/feedback', {
        headers: { 'x-workspace-id': wsId },
      })
      const result = await res.json()
      if (result.success) {
        setFeedbacks(result.data)
      } else {
        setErrorMsg(result.error || 'Failed to fetch feedbacks')
      }
    } catch (err) {
      setErrorMsg('Fetch error: ' + (err as Error).message)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  useEffect(() => {
    if (activeWorkspaceId) {
      fetchFeedbacks(activeWorkspaceId)
    }
  }, [activeWorkspaceId])

  // Create Workspace
  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWsName.trim()) return
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWsName }),
      })
      const result = await res.json()
      if (result.success) {
        setNewWsName('')
        fetchWorkspaces()
        setActiveWorkspaceId(result.data.id)
      }
    } catch (err) {
      setErrorMsg('Failed to create workspace')
    }
  }

  // Submit Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !activeWorkspaceId) return

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': activeWorkspaceId,
        },
        body: JSON.stringify({ content }),
      })
      const result = await res.json()
      if (result.success) {
        setContent('')
        fetchFeedbacks(activeWorkspaceId)
      } else {
        setErrorMsg('Submit error: ' + (result.error || 'Failed'))
      }
    } catch (err) {
      setErrorMsg('Submit exception: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Multi-Tenant Dashboard</h1>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error: </strong>{errorMsg}
        </div>
      )}

      {/* Workspace Switcher Bar */}
      <div className="bg-gray-100 p-4 rounded-lg mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-700">Select Active Workspace:</label>
          <select
            value={activeWorkspaceId}
            onChange={(e) => setActiveWorkspaceId(e.target.value)}
            className="p-2 border rounded-lg bg-white text-black font-medium"
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Workspace */}
        <form onSubmit={handleCreateWorkspace} className="flex gap-2 pt-2 border-t border-gray-300">
          <input
            type="text"
            value={newWsName}
            onChange={(e) => setNewWsName(e.target.value)}
            placeholder="New Workspace Name..."
            className="p-2 border rounded-lg flex-1 text-black"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
            + Create Workspace
          </button>
        </form>
      </div>

      {/* Submit Feedback Form */}
      <form onSubmit={handleSubmitFeedback} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Submit New Feedback</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
            rows={3}
            placeholder="Type your feedback here..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      {/* Feedback List Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Submitted Feedbacks</h2>
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedbacks found for this workspace.</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg bg-gray-50 text-black">
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}