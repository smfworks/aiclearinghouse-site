import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AgentCompareClient from "@/components/AgentCompareClient";
import { getAllAgents } from "@/lib/marketplace/loader";

export const metadata: Metadata = {
  title: "Compare Agents — SMF Clearinghouse",
  description: "Side-by-side comparison of autonomous AI agents by runtime, pricing, platforms, and features.",
};

export default function AgentComparePage() {
  const agents = getAllAgents();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <AgentCompareClient agents={agents} />
      </main>
      <Footer />
    </div>
  );
}
