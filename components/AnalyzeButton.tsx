"use client";

import { useTransition } from "react";
import { analyzeFeedbackAction } from "@/app/actions/analyze";

export default function AnalyzeButton({ feedbackId, slug }: { feedbackId: string; slug: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    startTransition(async () => {
      const res = await analyzeFeedbackAction(feedbackId, slug);
      if (!res.success) {
        alert("Error: " + res.error);
      }
    });
  };

  return (
    <button
      onClick={handleAnalyze}
      disabled={isPending}
      style={{
        padding: "6px 12px",
        background: isPending ? "#93c5fd" : "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: isPending ? "not-allowed" : "pointer",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {isPending ? "Analyzing..." : "Analyze with AI"}
    </button>
  );
}