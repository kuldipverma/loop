import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { createFeedbackAction } from "@/app/actions/feedback";

export default async function WorkspaceDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/signup");
  }

  const workspace = await db.workspace.findUnique({
    where: { slug },
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true },
      },
      feedbacks: {
        include: { createdBy: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header Section */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eaeaea", paddingBottom: "15px", marginBottom: "25px" }}>
        <div>
          <h1 style={{ margin: 0 }}>🏢 {workspace.name}</h1>
          <p style={{ color: "#666", margin: "5px 0 0 0" }}>
            Workspace Slug: <code>{workspace.slug}</code>
          </p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </form>
      </header>

      {/* Day 5: Add Feedback Form */}
      <section style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #ddd" }}>
        <h2 style={{ marginTop: 0 }}>Add Feedback</h2>
        <form action={createFeedbackAction} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="hidden" name="workspaceId" value={workspace.id} />
          <input type="hidden" name="slug" value={workspace.slug} />

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Content</label>
            <textarea
              name="content"
              placeholder="Feedback text detail..."
              required
              rows={3}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Channel</label>
            <select name="channel" required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="Support Ticket">Support Ticket</option>
              <option value="App Store">App Store</option>
              <option value="NPS Survey">NPS Survey</option>
              <option value="Sales Call">Sales Call</option>
              <option value="Community">Community</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Customer Label (Optional)</label>
            <input
              type="text"
              name="customerLabel"
              placeholder="e.g. VIP, Churned, Enterprise"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <button
            type="submit"
            style={{ background: "#0070f3", color: "#fff", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", width: "150px" }}
          >
            Submit Feedback
          </button>
        </form>
      </section>

      {/* Day 5: Feedback List */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Feedback List</h2>
        {workspace.feedbacks.length === 0 ? (
          <p style={{ color: "#777" }}>Abhi tak koi feedback submit nahi hua hai.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {workspace.feedbacks.map((fb) => (
              <div key={fb.id} style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "15px", background: "#fff" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "500" }}>{fb.content}</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ background: "#e6f7ff", color: "#1890ff", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", border: "1px solid #91d5ff" }}>
                    📌 {fb.channel}
                  </span>
                  {fb.customerLabel && (
                    <span style={{ background: "#f6ffed", color: "#52c41a", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", border: "1px solid #b7eb8f" }}>
                      🏷️ {fb.customerLabel}
                    </span>
                  )}
                  <small style={{ color: "#888", marginLeft: "auto" }}>
                    By {fb.createdBy.name}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Team Members */}
      <section>
        <h2>Team Members</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {workspace.users.map((user) => (
            <div key={user.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", background: "#fafafa" }}>
              <h4 style={{ margin: "0 0 4px 0" }}>
                {user.name} <span style={{ fontSize: "12px", color: "#0070f3" }}>({user.role})</span>
              </h4>
              <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>{user.email}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}