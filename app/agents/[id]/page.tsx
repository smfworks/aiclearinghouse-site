import { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AgentDetail from "@/components/AgentDetail";
import { getAgentBySlug, getAllAgents } from "@/lib/marketplace/loader";

export function generateStaticParams() {
  return getAllAgents().map((agent) => ({ id: agent.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgentBySlug(id);
  if (!agent) return {};
  return {
    title: `${agent.name} — SMF Clearinghouse`,
    description: `${agent.tagline} Built by ${agent.company}. Pricing: ${agent.pricing}. Runtime: ${agent.runtime}. Categories: ${agent.categories.join(", ")}.`,
    keywords: [agent.name, agent.company, "AI agent", ...agent.categories, agent.runtime, agent.pricing],
    openGraph: {
      title: `${agent.name} — Autonomous AI Agent`,
      description: agent.tagline,
      url: `https://smfclearinghouse.com/agents/${agent.id}`,
      siteName: "SMF Clearinghouse",
      type: "article",
      images: [
        {
          url: `https://smfclearinghouse.com/images/agents/${agent.id}.svg`,
          width: 128,
          height: 128,
          alt: `${agent.name} avatar`,
        },
      ],
    },
  };
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgentBySlug(id);
  if (!agent) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12">
        <AgentDetail agent={agent} />
      </main>
      <Footer />
    </div>
  );
}
