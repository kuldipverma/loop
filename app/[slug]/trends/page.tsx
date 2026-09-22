import { getTrendsData } from "@/app/actions/trends";
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from "lucide-react";

export default async function TrendsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let trends = await getTrendsData(slug);

  // Fallback mock data agar database me timeline records kam ho
  if (!trends || trends.length === 0) {
    trends = [
      { theme: "Onboarding", previous: 20, current: 35, growth: 75, isSpike: true },
      { theme: "Checkout & Payments", previous: 15, current: 12, growth: -20, isSpike: false },
      { theme: "Performance", previous: 10, current: 18, growth: 80, isSpike: true },
      { theme: "Mobile Experience", previous: 8, current: 8, growth: 0, isSpike: false },
    ];
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity color="#2563eb" />
          DAY 14 — Trends & Spike Detection
        </h1>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
          Theme volume changes over time (Current Period vs Previous Period).
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {trends.map((item) => (
          <div
            key={item.theme}
            style={{
              padding: "20px",
              border: item.isSpike ? "2px solid #ef4444" : "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              position: "relative",
            }}
          >
            {item.isSpike && (
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <AlertTriangle size={12} /> SPIKE DETECTED
              </span>
            )}

            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>{item.theme}</h3>

            <div style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px" }}>
              <div>Previous Period: <strong>{item.previous}</strong></div>
              <div>Current Period: <strong>{item.current}</strong></div>
            </div>

            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Growth / Trend:</span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: item.growth > 0 ? "#16a34a" : item.growth < 0 ? "#dc2626" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {item.growth > 0 ? <TrendingUp size={16} /> : item.growth < 0 ? <TrendingDown size={16} /> : null}
                {item.growth > 0 ? `+${item.growth}%` : `${item.growth}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}