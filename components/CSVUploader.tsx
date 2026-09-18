"use client";

import { useState } from "react";
import Papa from "papaparse";
import { uploadCSVFeedbacksAction } from "@/app/actions/feedback";

export default function CSVUploader({
  workspaceId,
  userId,
  slug,
}: {
  workspaceId: string;
  userId: string;
  slug: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("Parsing CSV file...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setStatus("Uploading & Validating records...");
        const data = results.data as any[];

        const res = await uploadCSVFeedbacksAction(data, workspaceId, userId, slug);
        setStatus(`Upload Complete! Success: ${res.successCount}, Failed: ${res.failureCount}`);
        setLoading(false);
      },
      error: () => {
        setStatus("Failed to read CSV file.");
        setLoading(false);
      },
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h3 className="font-bold text-slate-800 mb-2">📁 Import Feedbacks via CSV</h3>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={loading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
      />
      {status && <p className="text-xs font-semibold mt-3 text-indigo-600">{status}</p>}
    </div>
  );
}