import { getThemeClusters } from "@/app/actions/trends";
import TrendsClient, { ClusterItem } from "@/components/trends-client";
import { Layers } from "lucide-react";

export default async function TrendsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let dbClusters = await getThemeClusters(slug);

  const clusters: ClusterItem[] = dbClusters && dbClusters.length > 0 ? dbClusters : [
    {
      id: "1",
      name: "Support Ticket",
      description: "All feedback collected regarding Support Ticket.",
      sentiment: "Neutral",
      feedbackCount: 4,
      feedbacks: [
        { id: "f1", title: "Login issue", description: "User unable to login", sentiment: "Negative" },
        { id: "f2", title: "Payment failed", description: "Card charged but order not placed", sentiment: "Negative" },
        { id: "f3", title: "Slow response time", description: "Support agent took 2 hours to reply", sentiment: "Neutral" },
        { id: "f4", title: "App crashes on submit", description: "Ticket submission button freezes screen", sentiment: "Negative" },
      ]
    },
    {
      id: "2",
      name: "Checkout & Payments",
      description: "Issues related to checkout flow and card payment failures.",
      sentiment: "Negative",
      feedbackCount: 3,
      feedbacks: [
        { id: "f5", title: "Payment failed", description: "Card charged but order not placed", sentiment: "Negative" },
        { id: "f6", title: "UPI Gateway Error", description: "Transaction timeout during payment", sentiment: "Negative" },
        { id: "f7", title: "Coupon Code Error", description: "Discount code not applying at checkout", sentiment: "Neutral" },
      ]
    },
    {
      id: "3",
      name: "UI / UX Feedback",
      description: "User suggestions regarding application navigation and dashboard look.",
      sentiment: "Positive",
      feedbackCount: 5,
      feedbacks: [
        { id: "f8", title: "Dashboard looks great", description: "Quick support response and clean UI", sentiment: "Positive" },
        { id: "f9", title: "Dark Mode Request", description: "Please add dark theme support", sentiment: "Neutral" },
        { id: "f10", title: "Smooth Animation", description: "Page transitions are smooth", sentiment: "Positive" },
        { id: "f11", title: "Mobile View Improvement", description: "Sidebar overlaps on mobile screen", sentiment: "Neutral" },
        { id: "f12", title: "Easy Search Feature", description: "Filtering feeds is very intuitive", sentiment: "Positive" },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Layers className="w-8 h-8 text-primary" />
          Theme Clusters
        </h1>
        <p className="text-muted-foreground mt-1">
          Grouped feedback by auto-detected themes and intent.
        </p>
      </div>

      <TrendsClient clusters={clusters} />
    </div>
  );
}