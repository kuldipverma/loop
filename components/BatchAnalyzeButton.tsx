"use client";

import { useState } from "react";
import { processBatchAnalysisAction } from "@/app/actions/batch-analyze";

export default function BatchAnalyzeButton({
  workspaceId,
  slug,
}: {
  workspaceId: string;
  slug: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleBatchAnalyze() {
    setLoading(true);
    setMessage("");

    const res = await processBatchAnalysisAction(workspaceId, slug);

    if (res.success) {
      if (res.count === 0) {
        setMessage("Sabhi feedbacks pehle se analyzed hain!");
      } else {
        setMessage(`Successfully analyzed ${res.count} feedbacks with AI!`);
      }
    } else {
      setMessage(`Error: ${res.error}`);
    }

    setLoading(false);
  }

  return (
    <div style={{ marginTop: "15px", marginBottom: "20px" }}>
      <button
        onClick={handleBatchAnalyze}
        disabled={loading}
        style={{
          padding: "10px 18px",
          backgroundColor: loading ? "#93c5fd" : "#7c3aed",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Analyzing Batch with AI..." : "Run AI Batch Analysis (Day 12)"}
      </button>
      {message && (
        <p style={{ marginTop: "8px", fontSize: "14px", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}