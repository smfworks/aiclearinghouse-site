import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AgentCompareClient from "@/components/AgentCompareClient";
import { getAllAgents, getAgentBySlug } from "@/lib/marketplace/loader";

export const metadata: Metadata = {
  title: "Compare Agents — SMF Clearinghouse",
  description: "Side-by-side comparison of autonomous AI agents by runtime, pricing, platforms, and features.",
};

function CompareContent({ ids }: { ids: string[] }) {
  const allAgents = getAllAgents();
  const selected = ids
    .map((id) => getAgentBySlug(id))
    .filter((a): a is NonNullable<typeof a> => a !== null);

  if (ids.length > 0 && selected.length !== ids.length) {
    notFound();
  }

  return <AgentCompareClient agents={allAgents} selected={selected} />;
}

export default function AgentComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const ids = searchParams.ids ? searchParams.ids.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-foreground-secondary font-mono">Loading comparison...</div>}>
          <CompareContent ids={ids} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
