"use client";

import { useState } from "react";
import { reclassifyFeedbackAction } from "@/app/actions/classify";

interface Props {
  feedbackId: string;
  slug: string;
}

export default function ReclassifyButton({ feedbackId, slug }: Props) {
  const [loading, setLoading] = useState(false);

  const handleReclassify = async () => {
    setLoading(true);
    await reclassifyFeedbackAction(feedbackId, slug);
    setLoading(false);
  };

  return (
    <button
      onClick={handleReclassify}
      disabled={loading}
      className="px-3 py-1 text-xs font-semibold rounded bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition"
    >
      {loading ? "Classifying..." : "Re-classify"}
    </button>
  );
}