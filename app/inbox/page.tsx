import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateFeedbackStatusAction } from "@/app/actions/feedback";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/signup");

  const { search, status, page } = await searchParams;

  const currentPage = Number(page) || 1;
  const pageSize = 5;

  const whereCondition: any = {};

  if (search) {
    whereCondition.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    whereCondition.status = status;
  }

  // Server-side Pagination
  const totalItems = await db.feedback.count({ where: whereCondition });
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const feedbacks = await db.feedback.findMany({
    where: whereCondition,
    include: { user: { select: { name: true } }, workspace: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "32px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>📥 Feedback Inbox (Day 8)</h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>Manage, filter, and transition status of feedbacks</p>
          </div>
        </div>

        {/* Filters Form */}
        <form method="GET" style={{ display: "flex", gap: "12px", marginBottom: "20px", backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
            placeholder="🔍 Search title or description..."
            style={{ flex: 2, padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
          />
          <select
            name="status"
            defaultValue={status || "ALL"}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#fff" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="REVIEWED">REVIEWED</option>
            <option value="ACTIONED">ACTIONED</option>
          </select>
          <button type="submit" style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
            Apply Filter
          </button>
        </form>

        {/* Feedback Table */}
        <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                <th style={{ padding: "12px 16px" }}>Title & Description</th>
                <th style={{ padding: "12px 16px" }}>Channel</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>No feedback items found.</td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ margin: 0, fontWeight: "600", color: "#0f172a" }}>{fb.title}</p>
                      <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "13px" }}>{fb.description}</p>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#334155" }}>{fb.channel}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: fb.status === "NEW" ? "#fef3c7" : fb.status === "REVIEWED" ? "#dbeafe" : "#dcfce7",
                        color: fb.status === "NEW" ? "#92400e" : fb.status === "REVIEWED" ? "#1e40af" : "#166534",
                      }}>
                        {fb.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {fb.status !== "REVIEWED" && (
                          <form action={async () => { "use server"; await updateFeedbackStatusAction(fb.id, "REVIEWED"); }}>
                            <button type="submit" style={{ padding: "4px 8px", fontSize: "12px", borderRadius: "4px", border: "1px solid #cbd5e1", cursor: "pointer" }}>Mark REVIEWED</button>
                          </form>
                        )}
                        {fb.status !== "ACTIONED" && (
                          <form action={async () => { "use server"; await updateFeedbackStatusAction(fb.id, "ACTIONED"); }}>
                            <button type="submit" style={{ padding: "4px 8px", fontSize: "12px", borderRadius: "4px", border: "1px solid #cbd5e1", cursor: "pointer", backgroundColor: "#10b981", color: "#fff" }}>Mark ACTIONED</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Page {currentPage} of {totalPages}
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {currentPage > 1 && (
              <a
                href={`/inbox?page=${currentPage - 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                style={{ padding: "8px 14px", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", textDecoration: "none", color: "#0f172a", fontSize: "14px" }}
              >
                Previous
              </a>
            )}
            {currentPage < totalPages && (
              <a
                href={`/inbox?page=${currentPage + 1}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`}
                style={{ padding: "8px 14px", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", textDecoration: "none", color: "#0f172a", fontSize: "14px" }}
              >
                Next
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}