import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getLLMProviders, getAllLLMModels, getLLMCategories } from "@/lib/marketplace/llm-data";
import { formatPrice, formatNumber } from "@/lib/marketplace/format";

export const metadata = {
  title: "LLM Directory — SMF Clearinghouse",
  description: "Compare LLM pricing, context windows, and benchmarks across 14 providers and 120+ models.",
};

const typeLabel: Record<string, string> = {
  provider: "LLM Provider",
  platform: "Hosted Platform",
};

const categoryOrder = [
  "Flagship", "Reasoning", "Mid-range", "Coding", "Multimodal",
  "Budget", "Open Source", "Popular", "Featured", "Hosted", "RAG",
  "Legacy", "Embedding", "Reranking", "Image", "Video", "Speech", "Music", "Edge",
];

export default function LLMsPage() {
  const providers = getLLMProviders();
  const allModels = getAllLLMModels();
  const categories = getLLMCategories();

  // Stats
  const totalModels = allModels.length;
  const providerCount = providers.filter(p => p.type === "provider").length;
  const platformCount = providers.filter(p => p.type === "platform").length;
  const freeModels = allModels.filter(m => m.input_price === 0).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
          <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-6">
            <Link href="/" className="text-sm text-foreground-secondary transition-colors hover:text-foreground">
              ← Home
            </Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">LLM Directory</h1>
            <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
              Compare pricing, context windows, and benchmarks across <strong>{totalModels}</strong> models from{" "}
              <strong>{providerCount}</strong> providers and <strong>{platformCount}</strong> hosted platforms.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-mono text-foreground-secondary">
              <span className="rounded-full border border-hairline bg-panel px-3 py-1">
                {totalModels} models
              </span>
              <span className="rounded-full border border-hairline bg-panel px-3 py-1">
                {freeModels} free / open-source
              </span>
              <span className="rounded-full border border-hairline bg-panel px-3 py-1">
                Updated 2026-06-15
              </span>
            </div>
          </div>
        </section>

        {/* Provider Cards */}
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <h2 className="text-2xl font-semibold mb-2">LLM Providers</h2>
          <p className="text-foreground-secondary mb-8">
            Companies that build and host their own foundation models.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.filter(p => p.type === "provider").map((p) => {
              const flagship = p.models.find(m => m.category === "Flagship");
              const cheapest = p.models.filter(m => m.input_price !== null && m.input_price > 0).sort((a, b) => (a.input_price ?? 0) - (b.input_price ?? 0))[0];
              return (
                <Link
                  key={p.id}
                  href={`/llms/${p.id}`}
                  className="group rounded-xl border border-hairline bg-panel p-6 transition-all hover:border-foreground-secondary hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-elevated">
                      <Image src={p.icon} alt={p.name} fill className="object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-foreground-secondary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-foreground-tertiary font-mono">{p.models.length} models</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-foreground-secondary line-clamp-2">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
                    {flagship && (
                      <span className="rounded-full bg-blue-500/10 text-blue-400 px-2 py-0.5">
                        From {formatPrice(flagship.input_price)}
                      </span>
                    )}
                    {cheapest && cheapest !== flagship && (
                      <span className="rounded-full bg-green-500/10 text-green-400 px-2 py-0.5">
                        Budget {formatPrice(cheapest.input_price)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Platform Cards */}
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <h2 className="text-2xl font-semibold mb-2">Hosted Platforms</h2>
          <p className="text-foreground-secondary mb-8">
            Unified APIs that serve models from multiple providers — one key, many models.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.filter(p => p.type === "platform").map((p) => {
              const modelCount = p.models.length;
              const priceRange = p.models.filter(m => m.input_price !== null && m.input_price > 0);
              const minPrice = priceRange.length ? Math.min(...priceRange.map(m => m.input_price ?? 0)) : 0;
              const maxPrice = priceRange.length ? Math.max(...priceRange.map(m => m.input_price ?? 0)) : 0;
              return (
                <Link
                  key={p.id}
                  href={`/llms/${p.id}`}
                  className="group rounded-xl border border-hairline bg-panel p-6 transition-all hover:border-foreground-secondary hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-elevated">
                      <Image src={p.icon} alt={p.name} fill className="object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-foreground-secondary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-foreground-tertiary font-mono">{modelCount} models</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-foreground-secondary line-clamp-2">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
                    {minPrice > 0 && (
                      <>
                        <span className="rounded-full bg-blue-500/10 text-blue-400 px-2 py-0.5">
                          {formatPrice(minPrice)} – {formatPrice(maxPrice)}/1M
                        </span>
                      </>
                    )}
                    {p.models.filter(m => m.input_price === 0).length > 0 && (
                      <span className="rounded-full bg-green-500/10 text-green-400 px-2 py-0.5">
                        {p.models.filter(m => m.input_price === 0).length} free
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Full Comparison Table */}
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <h2 className="text-2xl font-semibold mb-2">Full Comparison</h2>
          <p className="text-foreground-secondary mb-6">
            All models sortable by provider, price, and context window. Click a provider name for details.
          </p>
          <div className="overflow-hidden rounded-xl border border-hairline bg-panel">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-hairline bg-elevated">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                      Model
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                      Input / 1M
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                      Output / 1M
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                      Context
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden md:table-cell">
                      MMLU
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono hidden md:table-cell">
                      HumanEval
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {providers.map((p) =>
                    p.models.map((m, i) => (
                      <tr key={`${p.id}-${m.model_id}`} className="transition-colors hover:bg-elevated/50">
                        {i === 0 ? (
                          <td className="px-4 py-3 font-medium text-foreground align-top" rowSpan={p.models.length}>
                            <Link href={`/llms/${p.id}`} className="hover:underline">{p.name}</Link>
                          </td>
                        ) : null}
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground text-sm">{m.model}</div>
                          {m.description && (
                            <div className="text-xs text-foreground-tertiary line-clamp-1">{m.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${
                            m.category === "Flagship" ? "bg-blue-500/10 text-blue-400" :
                            m.category === "Reasoning" ? "bg-purple-500/10 text-purple-400" :
                            m.category === "Budget" ? "bg-green-500/10 text-green-400" :
                            m.category === "Open Source" || m.input_price === 0 ? "bg-amber-500/10 text-amber-400" :
                            m.category === "Coding" ? "bg-cyan-500/10 text-cyan-400" :
                            "bg-elevated text-foreground-secondary"
                          }`}>
                            {m.category || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono">
                          {formatPrice(m.input_price)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono">
                          {formatPrice(m.output_price)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono">
                          {m.context_window ? formatNumber(m.context_window) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono hidden md:table-cell">
                          {m.mmlu ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono hidden md:table-cell">
                          {m.humaneval ?? "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-xs text-foreground-tertiary">
            Source: provider pricing pages. Prices are per 1M tokens unless noted. Benchmarks from public leaderboards. Free models ($0) are open-weight — run locally or via hosted platform.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}