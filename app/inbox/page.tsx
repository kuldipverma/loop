import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import FeedbackFilters from "@/components/FeedbackFilters";
import AnalyzeButton from "@/components/AnalyzeButton";

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

  let filteredFeedbacks = feedbacks;
  if (params.sentiment && params.sentiment !== "ALL") {
    filteredFeedbacks = filteredFeedbacks.filter((f: any) =>
      (f.sentiment || "").toUpperCase().includes(params.sentiment!.toUpperCase())
    );
  }

  if (params.theme && params.theme !== "ALL") {
    filteredFeedbacks = filteredFeedbacks.filter((f: any) =>
      (f.theme || "").toUpperCase().includes(params.theme!.toUpperCase())
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>DAY 11 — Feedback Inbox & AI Integration ({filteredFeedbacks.length})</h2>

      <FeedbackFilters />

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #ddd", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Title & Description</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Channel</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>AI Sentiment & Theme</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>AI Analysis Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                No feedback records found.
              </td>
            </tr>
          ) : (
            filteredFeedbacks.map((f: any) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>
                  <strong>{f.title}</strong>
                  <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>{f.description}</p>
                </td>
                <td style={{ padding: "10px" }}>{f.channel || "N/A"}</td>
                <td style={{ padding: "10px" }}>
                  {f.sentiment ? (
                    <div>
                      <span style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        background: f.sentiment === "POSITIVE" ? "#dcfce7" : f.sentiment === "NEGATIVE" ? "#fee2e2" : "#e2e8f0",
                        color: f.sentiment === "POSITIVE" ? "#166534" : f.sentiment === "NEGATIVE" ? "#991b1b" : "#475569"
                      }}>
                        {f.sentiment}
                      </span>
                      {f.theme && <p style={{ fontSize: "12px", margin: "4px 0 0", color: "#555" }}>Theme: {f.theme}</p>}
                    </div>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#888" }}>Not Analyzed</span>
                  )}
                </td>
                <td style={{ padding: "10px" }}>
                  <AnalyzeButton feedbackId={f.id} slug="inbox" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}