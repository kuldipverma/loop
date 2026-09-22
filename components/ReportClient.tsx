"use client";

import { useState } from "react";
import { generateReportAction, ReportData } from "../app/actions/report";
import { FileText, Loader2, Calendar, CheckCircle2, Quote, TrendingUp } from "lucide-react";

export default function ReportClient({ slug }: { slug: string }) {
  const [daysFilter, setDaysFilter] = useState("30");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await generateReportAction(slug, daysFilter);
      if (res.success && res.data) {
        setReport(res.data);
      } else {
        setError(res.error || "Failed to generate report.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="border rounded-xl p-6 bg-card shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Voice-of-Customer Report
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate automated customer feedback summary for workspace: <span className="font-semibold text-foreground">{slug}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {/* Generated Output */}
      {report && (
        <div className="space-y-6">
          <div className="border rounded-xl p-6 bg-card shadow-sm space-y-2">
            <h2 className="text-lg font-semibold">Executive Summary</h2>
            <p className="text-sm leading-relaxed text-muted-foreground bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
              {report.executiveSummary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-6 bg-card shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Top Themes</h2>
              <div className="space-y-2">
                {report.topThemes.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 rounded bg-muted/40">
                    <span className="font-medium">{t.theme}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-900 dark:text-indigo-300">
                      {t.count} feedbacks
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-xl p-6 bg-card shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Sentiment Breakdown</h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-xl font-bold">{report.sentimentBreakdown.positive}</div>
                  <div className="text-xs font-medium">Positive</div>
                </div>
                <div className="p-3 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xl font-bold">{report.sentimentBreakdown.neutral}</div>
                  <div className="text-xs font-medium">Neutral</div>
                </div>
                <div className="p-3 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="text-xl font-bold">{report.sentimentBreakdown.negative}</div>
                  <div className="text-xs font-medium">Negative</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-6 bg-card shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Quote className="w-5 h-5 text-indigo-500" />
              Customer Quotes
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {report.importantQuotes.map((q, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-muted/30 space-y-1">
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{q.title}</div>
                  <p className="text-xs italic text-muted-foreground">"{q.quote}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-xl p-6 bg-card shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Recommended Actions</h2>
            <ul className="space-y-2">
              {report.recommendedActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}