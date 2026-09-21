import { getTrendsDataAction } from "@/app/actions/trends";

export default async function TrendsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getTrendsDataAction(slug);

  if (!res.success || !res.trends) {
    return <div className="p-8 text-red-500">Error: {res.error}</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">DAY 14 — Trends & Volume Analysis</h1>
        <p className="text-gray-500">Current Period vs Previous Period comparison and spike detection</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {res.trends.map((item) => (
          <div
            key={item.theme}
            className="p-5 border rounded-xl shadow-sm bg-white space-y-3 relative"
          >
            {item.isSpike && (
              <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-300">
                ⚡ SPIKE DETECTED
              </span>
            )}

            <h3 className="text-lg font-semibold text-gray-800">{item.theme}</h3>

            <div className="text-sm text-gray-600 space-y-1">
              <div>Previous Period: <span className="font-semibold">{item.previous}</span></div>
              <div>Current Period: <span className="font-semibold">{item.current}</span></div>
            </div>

            <div className="pt-2 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">Growth:</span>
              <span
                className={`text-base font-bold ${
                  item.growthPercentage > 0
                    ? "text-green-600"
                    : item.growthPercentage < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {item.growthPercentage > 0 ? `+${item.growthPercentage}%` : `${item.growthPercentage}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}