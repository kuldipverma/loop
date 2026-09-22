import AskLoopClient from "@/components/AskLoopClient";

export default async function AskPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AskLoopClient slug={slug} />;
}