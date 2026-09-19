import { db } from "@/lib/db";
import { MessageSquare, TrendingDown, Clock } from "lucide-react";
import { FeedbackVolumeChart, SentimentChart, TopThemesChart } from "@/components/DashboardCharts";

export default async function AnalyticsDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Workspace find karo slug se
  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    return <div className="p-8">Workspace not found</div>;
  }

  // Workspace ke feedback fetch karo
  const allFeedbacks = await db.feedback.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "asc" },
  });

  const totalFeedback = allFeedbacks.length;

  // 1. Stat Cards Calculation
  const negativeCount = allFeedbacks.filter(
    (f) => f.sentiment?.toUpperCase() === "NEGATIVE"
  ).length;
  const negativePercentage =
    totalFeedback > 0 ? ((negativeCount / totalFeedback) * 100).toFixed(1) : "0";

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = allFeedbacks.filter(
    (f) => new Date(f.createdAt) >= oneWeekAgo
  ).length;

  // 2. Volume Over Time Data
  const volumeMap: Record<string, number> = {};
  allFeedbacks.forEach((f) => {
    const dateStr = new Date(f.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    volumeMap[dateStr] = (volumeMap[dateStr] || 0) + 1;
  });
  const volumeData = Object.keys(volumeMap).map((date) => ({
    date,
    count: volumeMap[date],
  }));

  // 3. Sentiment Data
  const sentimentCounts: Record<string, number> = { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 };
  allFeedbacks.forEach((f) => {
    const s = f.sentiment?.toUpperCase() || "NEUTRAL";
    sentimentCounts[s] = (sentimentCounts[s] || 0) + 1;
  });
  const sentimentData = [
    { name: "Positive", value: sentimentCounts.POSITIVE, color: "#22c55e" },
    { name: "Neutral", value: sentimentCounts.NEUTRAL, color: "#eab308" },
    { name: "Negative", value: sentimentCounts.NEGATIVE, color: "#ef4444" },
  ];

  // 4. Top Themes Data
  const themeMap: Record<string, number> = {};
  allFeedbacks.forEach((f) => {
    if (f.theme) {
      themeMap[f.theme] = (themeMap[f.theme] || 0) + 1;
    }
  });
  const topThemesData = Object.entries(themeMap)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DAY 10 — Analytics Dashboard</h1>
        <p className="text-muted-foreground">Real-time stats and metrics overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Feedback</h3>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalFeedback}</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Negative %</h3>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold">{negativePercentage}%</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">New This Week</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{newThisWeek}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 col-span-2">
          <h3 className="font-semibold text-lg pb-4">1. Feedback Volume Over Time</h3>
          <div className="h-[300px]">
            <FeedbackVolumeChart data={volumeData} />
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold text-lg pb-4">2. Sentiment Breakdown</h3>
          <div className="h-[300px]">
            <SentimentChart data={sentimentData} />
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold text-lg pb-4">3. Top Themes</h3>
          <div className="h-[300px]">
            <TopThemesChart data={topThemesData} />
          </div>
        </div>
      </div>
    </div>
  );
}