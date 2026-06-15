import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LLMCompareClient from "@/components/LLMCompareClient";
import { getLLMProviders, getAllLLMModels } from "@/lib/marketplace/llm-data";

export const metadata: Metadata = {
  title: "Compare LLMs — SMF Clearinghouse",
  description: "Side-by-side comparison of language models by price, context window, and benchmarks.",
};

function CompareContent({ ids }: { ids: string[] }) {
  const providers = getLLMProviders();
  const allModels = getAllLLMModels().map((m) => {
    const p = providers.find((p) => p.id === m.providerId);
    return { ...m, providerIcon: p?.icon || "" };
  });

  const selected = ids
    .map((id) => {
      const [providerId, modelId] = id.split(":");
      return allModels.find((m) => m.providerId === providerId && m.model_id === modelId);
    })
    .filter(Boolean) as (typeof allModels)[number][];

  if (ids.length > 0 && selected.length !== ids.length) {
    notFound();
  }

  const providerList = providers.map((p) => ({ id: p.id, name: p.name, icon: p.icon }));

  return <LLMCompareClient models={allModels} providers={providerList} selected={selected} />;
}

export default function LLMComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const ids = searchParams.ids ? searchParams.ids.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center text-foreground-secondary font-mono">
              Loading comparison...
            </div>
          }
        >
          <CompareContent ids={ids} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
