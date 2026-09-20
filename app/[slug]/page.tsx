import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import SimulatedChannelButtons from "@/components/SimulatedChannelButtons";
import BatchAnalyzeButton from "@/components/BatchAnalyzeButton";

interface WorkspacePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = await params;

  // 1. Workspace fetch
  const workspace = await db.workspace.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!workspace) {
    notFound();
  }

  // 2. Feedbacks fetch
  const feedbacks = await db.feedback.findMany({
    where: {
      workspaceId: workspace.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 font-sans">
      {/* Header Section */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">{workspace.name}</h1>
        <p className="text-sm text-slate-500 font-mono mt-1">
          Workspace Slug: /{workspace.slug}
        </p>
      </div>

      {/* Day 7: Simulated Channel Buttons */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-1">
          Simulated Channels (Day 7)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Click any button below to inject mock feedback data directly into your database.
        </p>

        <SimulatedChannelButtons workspaceId={workspace.id} />
      </div>

      {/* DAY 12: BATCH ANALYZE BUTTON (YEH LINE YAHAN AAYEGI) */}
      <div className="my-4">
        <BatchAnalyzeButton workspaceId={workspace.id} slug={slug} />
      </div>

      {/* Feedback List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Feedbacks ({feedbacks.length})
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-slate-400 text-sm italic">
            No feedbacks found.
          </p>
        ) : (
          <div className="grid gap-3">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start justify-between"
              >
                <div>
                  <p className="text-slate-800 font-medium">{item.content || item.title || item.description}</p>
                  <div className="flex gap-2 mt-2">
                    {item.channel && (
                      <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded font-mono">
                        {item.channel}
                      </span>
                    )}
                    {item.sentiment && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded font-semibold">
                        {item.sentiment}
                      </span>
                    )}
                    {item.theme && (
                      <span className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-600 rounded font-semibold">
                        {item.theme}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}