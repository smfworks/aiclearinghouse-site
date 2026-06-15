import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getLLMProviders, getLLMProvider } from "@/lib/marketplace/llm-data";
import { formatPrice, formatNumber } from "@/lib/marketplace/format";
import { LLMModel } from "@/lib/marketplace/types";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getLLMProviders().map((p) => ({ provider: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const p = getLLMProvider(provider);
  if (!p) return { title: "Provider Not Found" };
  return {
    title: `${p.name} Models & Pricing — SMF Clearinghouse`,
    description: p.description,
  };
}

const categoryColors: Record<string, string> = {
  Flagship: "bg-blue-500/10 text-blue-400",
  Reasoning: "bg-purple-500/10 text-purple-400",
  "Mid-range": "bg-sky-500/10 text-sky-400",
  Budget: "bg-green-500/10 text-green-400",
  "Open Source": "bg-amber-500/10 text-amber-400",
  Popular: "bg-indigo-500/10 text-indigo-400",
  Featured: "bg-indigo-500/10 text-indigo-400",
  Coding: "bg-cyan-500/10 text-cyan-400",
  Multimodal: "bg-pink-500/10 text-pink-400",
  RAG: "bg-orange-500/10 text-orange-400",
  Legacy: "bg-gray-500/10 text-gray-400",
  Hosted: "bg-teal-500/10 text-teal-400",
  Embedding: "bg-violet-500/10 text-violet-400",
  Reranking: "bg-violet-500/10 text-violet-400",
  Image: "bg-fuchsia-500/10 text-fuchsia-400",
  Video: "bg-fuchsia-500/10 text-fuchsia-400",
  Speech: "bg-rose-500/10 text-rose-400",
  Music: "bg-rose-500/10 text-rose-400",
  Edge: "bg-lime-500/10 text-lime-400",
  Chat: "bg-sky-500/10 text-sky-400",
  Agentic: "bg-purple-500/10 text-purple-400",
};

export default async function ProviderPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider: providerId } = await params;
  const provider = getLLMProvider(providerId);
  if (!provider) notFound();

  const allProviders = getLLMProviders();
  const grouped = groupByCategory(provider.models);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
          <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-6">
            <Link href="/llms" className="text-sm text-foreground-secondary transition-colors hover:text-foreground">
              ← LLM Directory
            </Link>
            <div className="mt-6 flex items-start gap-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-elevated">
                <Image src={provider.icon} alt={provider.name} fill className="object-contain p-2" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{provider.name}</h1>
                  <span className="rounded-full border border-hairline bg-elevated px-3 py-1 text-xs font-mono text-foreground-secondary">
                    {provider.type === "platform" ? "Hosted Platform" : "LLM Provider"}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-foreground-secondary">{provider.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-blue-500/10 text-blue-400 px-3 py-1 font-mono">
                    {provider.models.length} models
                  </span>
                  <Link
                    href="/llms/compare"
                    className="rounded-full border border-accent bg-accent/10 px-3 py-1 font-mono text-accent transition-colors hover:bg-accent/20"
                  >
                    Compare models →
                  </Link>
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-hairline bg-panel px-3 py-1 font-mono text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    Website →
                  </a>
                  <a
                    href={provider.pricing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-hairline bg-panel px-3 py-1 font-mono text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    Pricing →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Models by Category */}
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          {Object.entries(grouped).map(([category, models]) => (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-mono ${categoryColors[category] || "bg-elevated text-foreground-secondary"}`}>
                  {category}
                </span>
                <span className="text-foreground-tertiary text-sm font-normal">{models.length} model{models.length !== 1 ? "s" : ""}</span>
              </h2>
              <div className="overflow-hidden rounded-xl border border-hairline bg-panel">
                <table className="w-full text-sm">
                  <thead className="border-b border-hairline bg-elevated">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                        Model
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden sm:table-cell">
                        API ID
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                        Input / 1M
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                        Output / 1M
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden sm:table-cell">
                        Cached
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                        Context
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden md:table-cell">
                        Max Out
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden lg:table-cell">
                        MMLU
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden lg:table-cell">
                        HumanEval
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden xl:table-cell">
                        Released
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {models.map((m) => (
                      <tr key={m.model_id} className="transition-colors hover:bg-elevated/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{m.model}</div>
                          {m.description && (
                            <div className="text-xs text-foreground-tertiary line-clamp-1">{m.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-foreground-secondary hidden sm:table-cell">
                          {m.model_id}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-mono text-foreground-secondary">
                          {formatPrice(m.input_price)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-mono text-foreground-secondary">
                          {formatPrice(m.output_price)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-mono text-foreground-tertiary hidden sm:table-cell">
                          {formatPrice(m.cached_input_price)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-mono text-foreground-secondary">
                          {m.context_window ? formatNumber(m.context_window) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-mono text-foreground-tertiary hidden md:table-cell">
                          {m.max_output_tokens ? formatNumber(m.max_output_tokens) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-mono text-foreground-tertiary hidden lg:table-cell">
                          {m.mmlu ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-mono text-foreground-tertiary hidden lg:table-cell">
                          {m.humaneval ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground-tertiary hidden xl:table-cell">
                          {m.release_date || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Other Providers */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-12">
          <h2 className="text-xl font-semibold mb-4">Other Providers</h2>
          <div className="flex flex-wrap gap-3">
            {allProviders.filter(p => p.id !== providerId).map((p) => (
              <Link
                key={p.id}
                href={`/llms/${p.id}`}
                className="rounded-full border border-hairline bg-panel px-4 py-2 text-sm text-foreground-secondary hover:text-foreground hover:border-foreground-secondary transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function groupByCategory(models: LLMModel[]): Record<string, LLMModel[]> {
  const groups: Record<string, LLMModel[]> = {};
  const order = ["Flagship","Reasoning","Mid-range","Chat","Coding","Multimodal","RAG","Popular","Featured","Hosted","Budget","Open Source","Legacy","Embedding","Reranking","Image","Video","Speech","Music","Edge","Agentic"];
  for (const m of models) {
    const cat = m.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(m);
  }
  const sorted: Record<string, LLMModel[]> = {};
  for (const cat of order) {
    if (groups[cat]) sorted[cat] = groups[cat];
  }
  for (const [cat, ms] of Object.entries(groups)) {
    if (!sorted[cat]) sorted[cat] = ms;
  }
  return sorted;
}