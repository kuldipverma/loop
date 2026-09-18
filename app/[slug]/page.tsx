import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { createFeedbackAction } from "@/app/actions/feedback";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/signup");
  }

  const workspace = await db.workspace.findFirst({
    where: { slug },
    include: {
      users: true,
      feedbacks: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "32px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", backgroundColor: "#2563eb", color: "#fff", fontWeight: "bold", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#0f172a" }}>{workspace.name}</h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>slug: <span style={{ color: "#2563eb" }}>{workspace.slug}</span></p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "12px", backgroundColor: "#dbeafe", color: "#1e40af", padding: "6px 12px", borderRadius: "20px", fontWeight: "600" }}>Your Role: ADMIN</span>
            <form action={logoutAction}>
              <button type="submit" style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Create Feedback Form */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", marginTop: 0, marginBottom: "16px" }}>💬 Create Feedback</h2>
          <form action={createFeedbackAction} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="hidden" name="workspaceId" value={workspace.id} />
            <input type="hidden" name="slug" value={workspace.slug} />

            <input
              type="text"
              name="title"
              placeholder="Title (e.g. Add Dark Mode)"
              required
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
            />
            
            <textarea
              name="description"
              placeholder="Detailed description..."
              required
              rows={3}
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontFamily: "sans-serif" }}
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <select
                name="channel"
                required
                style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#fff" }}
              >
                <option value="Support Ticket">Support Ticket</option>
                <option value="App Store">App Store</option>
                <option value="NPS Survey">NPS Survey</option>
                <option value="Sales Call">Sales Call</option>
                <option value="Community">Community</option>
              </select>

              <input
                type="text"
                name="customerLabel"
                placeholder="Customer Label (e.g. VIP, Churned)"
                style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", width: "fit-content" }}
            >
              Post Feedback
            </button>
          </form>
        </div>

        {/* Feedbacks List */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", marginTop: 0, marginBottom: "16px" }}>📋 Feedbacks ({workspace.feedbacks.length})</h2>
          {workspace.feedbacks.length === 0 ? (
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>No feedback submitted yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {workspace.feedbacks.map((fb) => (
                <div key={fb.id} style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <h4 style={{ margin: 0, color: "#0f172a", fontSize: "16px" }}>{fb.title}</h4>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={{ fontSize: "12px", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "4px", fontWeight: "500" }}>
                        {fb.channel}
                      </span>
                      {fb.customerLabel && (
                        <span style={{ fontSize: "12px", backgroundColor: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: "4px", fontWeight: "500" }}>
                          {fb.customerLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: "0 0 10px 0", color: "#334155", fontSize: "14px" }}>{fb.description}</p>
                  <small style={{ color: "#64748b" }}>Posted by <strong>{fb.user.name}</strong></small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a", marginTop: 0, marginBottom: "16px" }}>👥 Team Members ({workspace.users.length})</h2>
          {workspace.users.map((u) => (
            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", marginBottom: "8px" }}>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: "#334155" }}>{u.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{u.email}</p>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", border: "1px solid #cbd5e1", padding: "2px 8px", borderRadius: "4px", height: "fit-content" }}>{u.role}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}