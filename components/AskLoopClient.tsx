"use client";

import { useState } from "react";
import { askLoopAction, AskResult } from "@/app/actions/ask";
import { MessageSquare, Sparkles, FileText, Loader2 } from "lucide-react";

export default function AskLoopClient({ slug }: { slug: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState("");

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await askLoopAction(query, slug);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err.message || "Client error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="border rounded-xl p-6 bg-card shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2>Ask LOOP</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Ask questions about your feedback and get grounded answers with evidence.
        </p>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What are customers saying about onboarding?"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-background"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            {loading ? "Searching..." : "Ask LOOP"}
          </button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {result && (
        <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-2">
              Grounded Answer
            </h3>
            <p className="text-base font-medium text-foreground bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
              {result.answer}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-3">
              Evidence / Feedback Used ({result.evidence.length})
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {result.evidence.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg bg-muted/40 text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    {item.title}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}