import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getLLMPricingData } from "@/lib/marketplace/llm-data";
import { formatPrice, formatNumber } from "@/lib/marketplace/format";

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
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">LLM Pricing</h1>
            <p className="mt-2 text-muted-foreground">
              Compare input/output cost, context window, and benchmarks. Updated {data.updated_at || "periodically"}.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold">Model</th>
                  <th className="px-4 py-3 text-right font-semibold">Input / 1M</th>
                  <th className="px-4 py-3 text-right font-semibold">Output / 1M</th>
                  <th className="px-4 py-3 text-right font-semibold">Context</th>
                  <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">MMLU</th>
                  <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">HumanEval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.models.map((m) => (
                  <tr key={m.model_id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{m.provider}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.model}</div>
                      <div className="text-xs text-muted-foreground">{m.notes}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPrice(m.input_price)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPrice(m.output_price)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatNumber(m.context_window)}</td>
                    <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">{m.mmlu ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">{m.humaneval ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {providers.map((p) => (
              <span key={p} className="rounded-full border border-border px-3 py-1 text-sm">{p}</span>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Source: provider pricing pages. Prices are per 1M tokens unless noted. Benchmarks are from public leaderboards.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
