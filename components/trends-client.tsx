"use client";

import { useState } from "react";

export interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  sentiment: string;
}

export interface ClusterItem {
  id: string;
  name: string;
  description: string;
  sentiment: string;
  feedbackCount: number;
  feedbacks?: FeedbackItem[];
}

export default function TrendsClient({ clusters }: { clusters: ClusterItem[] }) {
  const [selectedCluster, setSelectedCluster] = useState<ClusterItem | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            onClick={() => setSelectedCluster(cluster)}
            className="p-5 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{cluster.name}</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {cluster.feedbackCount} Feedbacks
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{cluster.description}</p>
          </div>
        ))}
      </div>

      {selectedCluster && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-background h-full p-6 overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedCluster.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">{selectedCluster.description}</p>
              </div>
              <button
                onClick={() => setSelectedCluster(null)}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
                UNDERLYING FEEDBACK ({selectedCluster.feedbacks?.length || 0})
              </h4>
              <div className="space-y-3">
                {selectedCluster.feedbacks?.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg border bg-muted/40 flex justify-between items-start gap-2">
                    <div>
                      <h5 className="font-medium text-sm">{item.title}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.sentiment === "Positive"
                          ? "bg-green-100 text-green-700"
                          : item.sentiment === "Negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}