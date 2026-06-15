import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getLLMPricingData } from "@/lib/marketplace/llm-data";
import { formatPrice, formatNumber } from "@/lib/marketplace/format";
import Link from "next/link";

export const metadata = {
  title: "LLM Pricing — SMF Clearinghouse",
  description: "Compare input/output pricing, context windows, and benchmark scores across leading models.",
};

export default function LLMsPage() {
  const data = getLLMPricingData();
  const providers = Array.from(new Set(data.models.map((m) => m.provider))).sort();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
          <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-6">
            <Link href="/" className="text-sm text-foreground-secondary transition-colors hover:text-foreground">
              ← Home
            </Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">LLM Pricing</h1>
            <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
              Compare input/output cost, context window, and benchmarks across leading models.
            </p>
            <p className="mt-2 text-xs font-mono text-foreground-tertiary">
              Updated {data.updated_at || "periodically"}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="overflow-hidden rounded-xl border border-hairline bg-panel">
            <table className="w-full text-sm">
              <thead className="border-b border-hairline bg-elevated">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                    Model
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
                {data.models.map((m) => (
                  <tr key={m.model_id} className="transition-colors hover:bg-elevated/50">
                    <td className="px-4 py-3 font-medium text-foreground">{m.provider}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{m.model}</div>
                      <div className="text-xs text-foreground-secondary">{m.notes}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono">
                      {formatPrice(m.input_price)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono">
                      {formatPrice(m.output_price)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono">
                      {formatNumber(m.context_window)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono hidden md:table-cell">
                      {m.mmlu ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground-secondary font-mono hidden md:table-cell">
                      {m.humaneval ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {providers.map((p) => (
              <span
                key={p}
                className="rounded-full border border-hairline bg-canvas px-3 py-1 text-sm text-foreground-secondary"
              >
                {p}
              </span>
            ))}
          </div>

          <p className="mt-6 text-xs text-foreground-tertiary">
            Source: provider pricing pages. Prices are per 1M tokens unless noted. Benchmarks are from public
            leaderboards.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
