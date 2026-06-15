import { Suspense } from "react";
import { getAllAgents, getAgentCategories, getAgentPricings, getAgentRuntimes } from "@/lib/marketplace/loader";
import AgentsDirectoryClient from "@/components/AgentsDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Agent Directory — SMF Clearinghouse",
  description: "Compare autonomous AI agents side-by-side. Filter by category, runtime, and pricing.",
};

export default function AgentsDirectoryPage({
  searchParams,
}: {
  searchParams?: { compare?: string };
}) {
  const agents = getAllAgents();
  const categories = getAgentCategories();
  const runtimes = getAgentRuntimes();
  const pricings = getAgentPricings();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center text-foreground-secondary font-mono">
              Loading agent directory...
            </div>
          }
        >
          <AgentsDirectoryClient
            agents={agents}
            categories={categories}
            runtimes={runtimes}
            pricings={pricings}
            initialCompare={searchParams?.compare}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
