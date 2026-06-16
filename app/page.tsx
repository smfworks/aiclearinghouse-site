import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HubClient from "@/components/HubClient";
import { getAllAgents, getAllItems, getSections } from "@/lib/marketplace/loader";
import type { MarketplaceItem } from "@/lib/marketplace/types";

export const metadata = {
  title: "SMF Clearinghouse — Independent AI Directory",
  description: "Compare autonomous AI agents, LLM pricing, open-source tools, vendor services, skills, guides, tips, tests, use cases, alternatives, and tested self-hosting recipes.",
};

export default function Home() {
  const agents = getAllAgents();
  const sections = getSections();
  const genericItems: Record<string, MarketplaceItem[]> = {};
  for (const section of sections) {
    if (section === "agents") continue;
    genericItems[section] = getAllItems(section);
  }
  const newsItems = (genericItems["ai-news"] || []).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <HubClient agents={agents} genericItems={genericItems} newsItems={newsItems} />
      </main>
      <Footer />
    </div>
  );
}
