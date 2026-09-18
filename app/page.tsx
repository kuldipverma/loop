import { db } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  const workspaces = await db.workspace.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Select Active Workspace</h1>
        <p className="text-sm text-slate-500 mb-6">Choose a workspace to access its dashboard</p>

        <div className="space-y-3">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/${ws.slug}`}
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition duration-150 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">{ws.name}</p>
                  <p className="text-xs text-slate-400 font-mono">/{ws.slug}</p>
                </div>
              </div>
              <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition">→</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link
            href="/signup"
            className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            + Create New Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}