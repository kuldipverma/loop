"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function FeedbackFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleReset() {
    router.push(pathname);
  }

  return (
    <div
      style={{
        background: "#f8f9fa",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
        marginBottom: "20px",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", color: "#333" }}>🔍 Day 9 Filters</h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        {/* 1. Search */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Search</label>
          <input
            type="text"
            placeholder="Search text..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        {/* 2. Channel Filter */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Channel</label>
          <select
            value={searchParams.get("channel") || "ALL"}
            onChange={(e) => handleFilterChange("channel", e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="ALL">All Channels</option>
            <option value="Support Ticket">Support Ticket</option>
            <option value="App Store">App Store</option>
            <option value="NPS Response">NPS Response</option>
          </select>
        </div>

        {/* 3. Sentiment Filter */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Sentiment</label>
          <select
            value={searchParams.get("sentiment") || "ALL"}
            onChange={(e) => handleFilterChange("sentiment", e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">POSITIVE</option>
            <option value="NEGATIVE">NEGATIVE</option>
            <option value="NEUTRAL">NEUTRAL</option>
          </select>
        </div>

        {/* 4. Theme Filter */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Theme</label>
          <select
            value={searchParams.get("theme") || "ALL"}
            onChange={(e) => handleFilterChange("theme", e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="ALL">All Themes</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Performance">Performance</option>
            <option value="Bug">Bug</option>
          </select>
        </div>

        {/* 5. Status Filter */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Status</label>
          <select
            value={searchParams.get("status") || "ALL"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="REVIEWED">REVIEWED</option>
            <option value="ACTIONED">ACTIONED</option>
          </select>
        </div>

        {/* 6. Date Range Filters */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>From Date</label>
          <input
            type="date"
            value={searchParams.get("fromDate") || ""}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>To Date</label>
          <input
            type="date"
            value={searchParams.get("toDate") || ""}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
      </div>

      <button
        onClick={handleReset}
        style={{
          marginTop: "12px",
          padding: "6px 12px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}