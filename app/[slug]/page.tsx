import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { createFeedbackAction, deleteFeedbackAction } from "@/app/actions/feedback";
import { updateMemberRoleAction } from "@/app/actions/member";
import { hasPermission, Role } from "@/lib/permissions";
import CSVUploader from "@/components/CSVUploader";

export default async function WorkspaceDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userId = await getSessionUserId();

  if (!userId) redirect("/signup");

  const currentUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) redirect("/signup");

  const workspace = await db.workspace.findUnique({
    where: { slug },
    include: {
      users: { select: { id: true, name: true, email: true, role: true } },
      feedbacks: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!workspace) notFound();

  const userRole = currentUser.role as Role;
  const canAddFeedback = hasPermission(userRole, "canAddFeedback");
  const canChangeRoles = hasPermission(userRole, "canChangeRoles");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">{workspace.name}</h1>
              <p className="text-xs text-slate-500 font-mono">
                slug: <span className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-semibold">{workspace.slug}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Your Role: {userRole}
            </span>
            <form action={logoutAction}>
              <button type="submit" className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          
          {/* CSV Uploader (Only for ADMIN and ANALYST) */}
          {canAddFeedback && (
            <CSVUploader workspaceId={workspace.id} slug={workspace.slug} />
          )}

          {/* Feedback Form */}
          {canAddFeedback ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">✍️ Submit Feedback</h2>
              <form action={createFeedbackAction} className="space-y-4">
                <input type="hidden" name="workspaceId" value={workspace.id} />
                <input type="hidden" name="slug" value={workspace.slug} />
                <input type="text" name="title" placeholder="Feedback Title" required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <textarea name="description" placeholder="Describe feedback..." required rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm shadow cursor-pointer">
                  Submit Feedback
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
              ℹ️ <strong>Read-Only Mode:</strong> As a <strong>VIEWER</strong>, you can view feedbacks but cannot create new ones.
            </div>
          )}

          {/* Feedback List */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">💡 Workspace Feedbacks ({workspace.feedbacks.length})</h2>
            {workspace.feedbacks.length === 0 ? (
              <p className="text-slate-500 text-sm bg-white border border-dashed p-6 rounded-xl text-center">No feedbacks yet.</p>
            ) : (
              <div className="space-y-4">
                {workspace.feedbacks.map((fb) => (
                  <div key={fb.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{fb.title}</h3>
                      <p className="text-slate-600 text-sm">{fb.description}</p>
                      <p className="text-xs text-slate-400 mt-2">Posted by <span className="font-medium text-slate-700">{fb.user.name}</span></p>
                    </div>
                    {canAddFeedback && (
                      <form action={deleteFeedbackAction}>
                        <input type="hidden" name="feedbackId" value={fb.id} />
                        <input type="hidden" name="slug" value={workspace.slug} />
                        <button type="submit" className="text-xs text-slate-400 hover:text-rose-600 font-semibold cursor-pointer">Delete</button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">👥 Team Members</h2>
            <div className="divide-y divide-slate-100">
              {workspace.users.map((member) => (
                <div key={member.id} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                  
                  {canChangeRoles && member.id !== currentUser.id ? (
                    <form action={updateMemberRoleAction}>
                      <input type="hidden" name="targetUserId" value={member.id} />
                      <input type="hidden" name="workspaceId" value={workspace.id} />
                      <input type="hidden" name="slug" value={workspace.slug} />
                      <select
                        name="role"
                        defaultValue={member.role}
                        onChange={(e) => e.target.form?.requestSubmit()}
                        className="text-xs bg-slate-100 border border-slate-300 rounded px-1 py-0.5 font-bold cursor-pointer"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    </form>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">
                      {member.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}