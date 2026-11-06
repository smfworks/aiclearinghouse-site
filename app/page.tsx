import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HubClient from "@/components/HubClient";
import ClearinghouseFaq from "@/components/ClearinghouseFaq";
import JsonLd from "@/components/JsonLd";
import { CLEARINGHOUSE_FAQS } from "@/lib/clearinghouse-faq";
import { loadHomeDirectory } from "@/lib/home-directory";
import { faqPageNode, jsonLdDocument } from "@/lib/seo";

export const metadata = {
  title: "SMF Clearinghouse — Independent AI Directory",
  description: "Compare autonomous AI agents, LLM pricing, open-source tools, vendor services, skills, guides, tips, tests, use cases, alternatives, and tested self-hosting recipes.",
};

export default function Home() {
  const { agents, genericItems, newsItems } = loadHomeDirectory();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <JsonLd data={jsonLdDocument(faqPageNode(CLEARINGHOUSE_FAQS))} />
        <HubClient agents={agents} genericItems={genericItems} newsItems={newsItems} />
        <ClearinghouseFaq className="mx-auto w-full max-w-3xl border-t border-hairline px-6 py-16" />
      </main>
      <Footer />
    </div>
  );
}
