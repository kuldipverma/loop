"use client";

import { useState } from "react";
import Papa from "papaparse";
import { processCSVRowsAction } from "@/app/actions/csv-upload";

export default function CSVUploader({
  workspaceId,
  slug,
}: {
  workspaceId: string;
  slug: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await processCSVRowsAction({
            rows: results.data,
            workspaceId,
            slug,
          });

          setStatus(`Upload Complete! Success: ${res.success}, Failed: ${res.failed}`);
        } catch (err) {
          setStatus("Failed to upload CSV");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mb-6">
      <h3 className="font-semibold text-lg mb-2">📥 Import Feedbacks via CSV</h3>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={loading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {loading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
      {status && <p className="text-sm font-medium mt-2">{status}</p>}
    </div>
  );
}