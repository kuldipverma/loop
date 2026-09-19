import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import FeedbackFilters from "@/components/FeedbackFilters";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    channel?: string;
    sentiment?: string;
    theme?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }>;
}) {
  const userId = await getSessionUserId();
  if (!userId) return <p style={{ padding: "20px" }}>Please login first.</p>;

  const params = await searchParams;

  // Build Prisma Where Clause dynamically
  const where: any = {};

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.channel && params.channel !== "ALL") {
    where.channel = params.channel;
  }

  if (params.status && params.status !== "ALL") {
    where.status = params.status;
  }

  if (params.fromDate || params.toDate) {
    where.createdAt = {};
    if (params.fromDate) {
      where.createdAt.gte = new Date(params.fromDate);
    }
    if (params.toDate) {
      const endDate = new Date(params.toDate);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDate;
    }
  }

  const feedbacks = await db.feedback.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Client-side filtering for sentiment/theme if not in DB schema
  let filteredFeedbacks = feedbacks;
  if (params.sentiment && params.sentiment !== "ALL") {
    filteredFeedbacks = filteredFeedbacks.filter((f: any) =>
      (f.sentiment || f.description || f.title || "")
        .toUpperCase()
        .includes(params.sentiment!.toUpperCase())
    );
  }

  if (params.theme && params.theme !== "ALL") {
    filteredFeedbacks = filteredFeedbacks.filter((f: any) =>
      (f.theme || f.description || f.title || "")
        .toUpperCase()
        .includes(params.theme!.toUpperCase())
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>DAY 9 — Filtered Feedbacks ({filteredFeedbacks.length})</h2>

      {/* Render Day 9 Filter Component */}
      <FeedbackFilters />

      {/* Feedbacks Display Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Title & Description</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Channel</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                No matching records found.
              </td>
            </tr>
          ) : (
            filteredFeedbacks.map((f) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>
                  <strong>{f.title}</strong>
                  <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>{f.description}</p>
                </td>
                <td style={{ padding: "10px" }}>{f.channel || "N/A"}</td>
                <td style={{ padding: "10px" }}>
                  <span style={{ padding: "4px 8px", borderRadius: "4px", background: "#e2e8f0", fontSize: "12px", fontWeight: "bold" }}>
                    {f.status}
                  </span>
                </td>
                <td style={{ padding: "10px", fontSize: "12px" }}>
                  {new Date(f.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}