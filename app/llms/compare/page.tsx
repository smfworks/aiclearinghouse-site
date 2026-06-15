import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LLMCompareClient from "@/components/LLMCompareClient";
import { getLLMProviders, getAllLLMModels } from "@/lib/marketplace/llm-data";

export const metadata: Metadata = {
  title: "Compare LLMs — SMF Clearinghouse",
  description: "Side-by-side comparison of language models by price, context window, and benchmarks.",
};

export default function LLMComparePage() {
  const providers = getLLMProviders();
  const allModels = getAllLLMModels().map((m) => {
    const p = providers.find((p) => p.id === m.providerId);
    return { ...m, providerIcon: p?.icon || "" };
  });

  const providerList = providers.map((p) => ({ id: p.id, name: p.name, icon: p.icon }));

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <LLMCompareClient models={allModels} providers={providerList} />
      </main>
      <Footer />
    </div>
  );
}
