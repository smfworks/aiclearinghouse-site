import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";
import {
  ArrowLeft,
  FlaskConical,
  BarChart3,
  Trophy,
  Calendar,
  Bot,
  Cpu,
  CheckCircle2,
  XCircle,
  Minus,
} from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  item: MarketplaceItem | null | undefined;
}

const categoryColors: Record<string, string> = {
  "Coding Benchmark": "text-cyan border-cyan/30 bg-cyan/5",
  "No-Code Benchmark": "text-amber border-amber/30 bg-amber/5",
  "Security Benchmark": "text-rose border-rose/30 bg-rose/5",
  "Integration Benchmark": "text-amber-400 border-amber-400/30 bg-amber-400/5",
};

const metricLabels: Record<string, string> = {
  score: "Score",
  time_minutes: "Time (min)",
  tokens: "Tokens",
  cost_usd: "Cost (USD)",
};

function parseSections(content: string): Array<{ key: string; html: string }> {
  const headingRegex = /^##\s+(.+)$/gim;
  const matches = Array.from(content.matchAll(headingRegex));
  if (matches.length === 0) {
    return [{ key: "overview", html: markdownToHtml(content) }];
  }

  const sections: Array<{ key: string; html: string }> = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const title = match[1].trim();
    const start = match.index! + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : content.length;
    const body = content.slice(start, end).trim();
    if (body) {
      sections.push({ key: title.toLowerCase(), html: markdownToHtml(body) });
    }
  }
  return sections;
}

function maxByMetric(results: MarketplaceItem["results"], key: keyof NonNullable<MarketplaceItem["results"]>[number]) {
  if (!results || results.length === 0) return 0;
  const vals = results.map((r) => (typeof r[key] === "number" ? (r[key] as number) : 0));
  return Math.max(...vals, 0.001);
}

function BarChart({ results, metric }: { results: MarketplaceItem["results"]; metric: "score" | "time_minutes" | "tokens" | "cost_usd" }) {
  if (!results || results.length === 0) return null;
  const max = maxByMetric(results, metric);
  const color = metric === "score" ? "#22d3ee" : metric === "time_minutes" ? "#f5a623" : metric === "tokens" ? "#a78bfa" : "#34d399";

  return (
    <div className="space-y-3">
      {results.map((r) => {
        const val = typeof r[metric] === "number" ? (r[metric] as number) : 0;
        const pct = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={r.agent} className="flex items-center gap-3 text-sm">
            <span className="w-28 truncate text-foreground-secondary">{r.agent}</span>
            <div className="flex-1 rounded-full bg-elevated">
              <div
                className="h-3 rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="w-20 text-right font-mono text-foreground">
              {metric === "cost_usd" ? `$${val.toFixed(2)}` : metric === "tokens" ? val.toLocaleString() : val}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ResultsTable({ results }: { results: MarketplaceItem["results"] }) {
  if (!results || results.length === 0) return null;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-hairline text-left">
          <th className="pb-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Agent</th>
          <th className="pb-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Score</th>
          <th className="pb-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Time</th>
          <th className="pb-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Cost</th>
          <th className="pb-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Pass</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={r.agent} className="border-b border-hairline last:border-b-0">
            <td className="py-3 font-medium text-foreground">{r.agent}</td>
            <td className="py-3 font-mono text-foreground-secondary">{r.score ?? "—"}</td>
            <td className="py-3 font-mono text-foreground-secondary">{r.time_minutes ? `${r.time_minutes}m` : "—"}</td>
            <td className="py-3 font-mono text-foreground-secondary">{typeof r.cost_usd === "number" ? `$${r.cost_usd.toFixed(2)}` : "—"}</td>
            <td className="py-3">
              {r.pass === true ? (
                <span className="inline-flex items-center gap-1 text-emerald">
                  <CheckCircle2 className="h-4 w-4" /> Pass
                </span>
              ) : r.pass === false ? (
                <span className="inline-flex items-center gap-1 text-rose">
                  <XCircle className="h-4 w-4" /> Fail
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-foreground-tertiary">
                  <Minus className="h-4 w-4" /> —
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TestDetail({ item }: Props) {
  if (!item) return null;

  const sections = parseSections(item.content);
  const colorClass = categoryColors[item.category] || "text-accent border-accent/30 bg-accent/5";
  const hasResults = item.results && item.results.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/tests"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to benchmarks
      </Link>

      <article className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        {/* Header */}
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
              <BarChart3 className="h-3.5 w-3.5" />
              {item.category}
            </span>
            {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-foreground-secondary">{item.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground-secondary">
            <span className="flex items-center gap-1.5">
              <Bot className="h-4 w-4" />
              {item.agents?.join(", ") || item.results?.map((r) => r.agent).join(", ")}
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4" />
              {item.llm || "Mixed models"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {item.date || item.last_verified || "2026"}
            </span>
          </div>

          {item.winner && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="text-sm text-foreground-secondary">Winner:</span>
              <span className="font-semibold text-foreground">{item.winner}</span>
            </div>
          )}
        </div>

        {/* Results dashboard */}
        {hasResults && (
          <div className="border-b border-hairline px-8 py-10 md:px-12">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
              <FlaskConical className="h-4 w-4" />
              Results dashboard
            </h2>

            <div className="grid gap-8 lg:grid-cols-2">
              {item.results?.some((r) => typeof r.score === "number") && (
                <div className="rounded-xl border border-hairline bg-elevated/30 p-5">
                  <h3 className="mb-4 text-sm font-medium text-foreground">Overall score</h3>
                  <BarChart results={item.results} metric="score" />
                </div>
              )}
              {item.results?.some((r) => typeof r.time_minutes === "number") && (
                <div className="rounded-xl border border-hairline bg-elevated/30 p-5">
                  <h3 className="mb-4 text-sm font-medium text-foreground">Time to complete</h3>
                  <BarChart results={item.results} metric="time_minutes" />
                </div>
              )}
              {item.results?.some((r) => typeof r.tokens === "number") && (
                <div className="rounded-xl border border-hairline bg-elevated/30 p-5">
                  <h3 className="mb-4 text-sm font-medium text-foreground">Tokens used</h3>
                  <BarChart results={item.results} metric="tokens" />
                </div>
              )}
              {item.results?.some((r) => typeof r.cost_usd === "number") && (
                <div className="rounded-xl border border-hairline bg-elevated/30 p-5">
                  <h3 className="mb-4 text-sm font-medium text-foreground">Approximate cost</h3>
                  <BarChart results={item.results} metric="cost_usd" />
                </div>
              )}
            </div>

            <div className="mt-8 rounded-xl border border-hairline bg-elevated/30 p-5">
              <h3 className="mb-4 text-sm font-medium text-foreground">Results table</h3>
              <ResultsTable results={item.results} />
            </div>
          </div>
        )}

        {/* Narrative sections */}
        <div className="grid gap-5 px-8 py-10 md:px-12">
          {sections.map((section) => (
            <div key={section.key} className="rounded-xl border border-hairline bg-elevated/30 p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-tertiary font-mono">
                {section.key.replace(/^\w/, (c) => c.toUpperCase())}
              </h2>
              <div
                className="prose prose-invert max-w-none prose-p:text-foreground-secondary prose-strong:text-foreground prose-li:text-foreground-secondary"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
