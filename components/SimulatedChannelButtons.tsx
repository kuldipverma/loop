"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { importSimulatedData } from "@/app/actions/simulate";

interface Props {
  workspaceId: string;
}

export default function SimulatedChannelButtons({ workspaceId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImport = async (channel: "support_ticket" | "app_review" | "nps_response") => {
    try {
      setLoading(true);
      const res = await importSimulatedData(workspaceId, channel);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        // Force refresh UI to show new data
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        disabled={loading}
        onClick={() => handleImport("support_ticket")}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import Support Tickets"}
      </button>

      <button
        disabled={loading}
        onClick={() => handleImport("app_review")}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import App Reviews"}
      </button>

      <button
        disabled={loading}
        onClick={() => handleImport("nps_response")}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import NPS Responses"}
      </button>
    </div>
  );
}