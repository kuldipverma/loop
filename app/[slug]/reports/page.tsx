import ReportClient from "@/components/ReportClient";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ReportClient slug={slug} />;
}