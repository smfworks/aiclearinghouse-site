"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AgentCard from "@/components/AgentCard";
import AgentComparison from "@/components/AgentComparison";
import SuggestAgentCTA from "@/components/SuggestAgentCTA";
import XVideoEmbed from "@/components/XVideoEmbed";
import { AgentProfile } from "@/lib/marketplace/types";

interface Props {
  agents: AgentProfile[];
  categories: string[];
  runtimes: string[];
  pricings: string[];
  videoTweetUrl?: string;
  suggestionEmail?: string;
}

const MAX_COMPARE = 3;

function useHydratedCompare(agents: AgentProfile[]) {
  const [compareParam, setCompareParam] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCompareParam(params.get("compare"));
  }, []);

  return useMemo(() => {
    return new Set(
      compareParam
        ? compareParam
            .split(",")
            .map((s) => s.trim())
            .filter((s) => agents.some((a) => a.id === s))
        : []
    );
  }, [compareParam, agents]);
}

export default function AgentsDirectoryClient({ agents, categories, runtimes, pricings, videoTweetUrl, suggestionEmail }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [runtime, setRuntime] = useState("All");
  const [pricing, setPricing] = useState("All");
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Hydrate compare state from URL on client
  const initialSelected = useHydratedCompare(agents);

  useEffect(() => {
    setSelected(initialSelected);
    setCompareOpen(initialSelected.size > 0);
    setIsClient(true);
  }, [initialSelected]);

  // Update URL when selection changes
  useEffect(() => {
    if (!isClient) return;
    const ids = Array.from(selected).join(",");
    const url = new URL(window.location.href);
    if (ids) {
      url.searchParams.set("compare", ids);
    } else {
      url.searchParams.delete("compare");
    }
    window.history.replaceState({}, "", url.toString());
  }, [selected, isClient]);

  const filtered = agents.filter((agent) => {
    const q = search.toLowerCase();
    const matchesSearch =
      agent.name.toLowerCase().includes(q) ||
      agent.tagline.toLowerCase().includes(q) ||
      agent.company.toLowerCase().includes(q) ||
      agent.categories.some((c) => c.toLowerCase().includes(q));
    const matchesCategory = category === "All" || agent.categories.includes(category);
    const matchesRuntime = runtime === "All" || agent.runtime === runtime;
    const matchesPricing = pricing === "All" || agent.pricing === pricing;
    const matchesOpenSource = !openSourceOnly || agent.openSource;
    return matchesSearch && matchesCategory && matchesRuntime && matchesPricing && matchesOpenSource;
  });

  const stats = {
    total: agents.length,
    openSource: agents.filter((a) => a.openSource).length,
    coding: agents.filter((a) => a.categories.includes("Coding")).length,
    noCode: agents.filter((a) => a.categories.includes("No-Code")).length,
  };

  const toggleCompare = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (next.size >= MAX_COMPARE) return;
      next.add(id);
    }
    setSelected(next);
    setCompareOpen(next.size > 0);
  };

  const statTile = (label: string, value: number | string, colorClass: string) => (
    <div className="rounded-xl border border-hairline bg-panel p-4 text-center">
      <p className={`text-3xl font-medium font-mono ${colorClass}`}>{value}</p>
      <p className="text-sm text-foreground-secondary">{label}</p>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-hairline px-6 py-20 md:py-28">
        <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-panel/80 px-4 py-1.5 text-xs font-medium text-foreground-secondary shadow-[0_0_20px_-8px_var(--cyan-glow)]">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            Live comparison directory
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Agent Directory</h1>
          <p className="mt-5 text-lg text-foreground-secondary md:text-xl">
            Compare autonomous AI agents side by side. Find the right coding agent, orchestrator,
            no-code builder, or enterprise assistant.
          </p>

          {videoTweetUrl && (
            <div className="mx-auto mt-8 max-w-xl rounded-xl border border-hairline bg-panel p-3 shadow-[0_0_40px_-16px_rgba(0,0,0,0.5)]">
              <XVideoEmbed tweetUrl={videoTweetUrl} className="min-h-[280px]" maxWidth={560} />
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {statTile("Agents listed", stats.total, "text-cyan")}
            {statTile("Open source", stats.openSource, "text-success")}
            {statTile("Coding agents", stats.coding, "text-amber")}
            {statTile("No-code builders", stats.noCode, "text-amber-400")}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="mb-8 rounded-xl border border-hairline bg-panel p-5 shadow-[0_0_30px_-12px_rgba(0,0,0,0.5)]">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, company, category..."
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-all focus:border-cyan focus:ring-1 focus:ring-cyan/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-all focus:border-cyan focus:ring-1 focus:ring-cyan/50"
              >
                <option value="All">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Runtime</label>
              <select
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-all focus:border-cyan focus:ring-1 focus:ring-cyan/50"
              >
                <option value="All">Any runtime</option>
                {runtimes.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Pricing</label>
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-all focus:border-cyan focus:ring-1 focus:ring-cyan/50"
              >
                <option value="All">Any pricing</option>
                {pricings.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-sm text-foreground transition-all hover:border-cyan/50 hover:text-cyan">
                <input
                  type="checkbox"
                  checked={openSourceOnly}
                  onChange={(e) => setOpenSourceOnly(e.target.checked)}
                  className="accent-cyan"
                />
                Open source only
              </label>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-foreground-secondary font-mono">Showing {filtered.length} of {agents.length} agents</p>
          <div className="flex items-center gap-3">
            {selected.size > 1 && (
              <Link
                href={`/agents/compare?ids=${Array.from(selected).join(",")}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-canvas px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-cyan/50 hover:text-cyan"
              >
                Full comparison
              </Link>
            )}
            {selected.size > 0 && (
              <button
                onClick={() => setCompareOpen(true)}
                className="rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-cyan-foreground transition-colors hover:bg-cyan-hover"
              >
                Compare ({selected.size})
              </button>
            )}
          </div>
        </div>

        {compareOpen && (
          <AgentComparison
            agents={agents.filter((a) => selected.has(a.id))}
            onClose={() => setCompareOpen(false)}
          />
        )}

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                compare={{
                  selected: selected.has(agent.id),
                  onToggle: () => toggleCompare(agent.id),
                  disabled: !selected.has(agent.id) && selected.size >= MAX_COMPARE,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <p className="text-lg text-foreground-secondary">No agents match your filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setRuntime("All");
                setPricing("All");
                setOpenSourceOnly(false);
              }}
              className="mt-4 text-cyan hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-16 rounded-xl border border-hairline bg-panel p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Suggest an Agent</h2>
          <p className="mt-2 text-foreground-secondary">
            Missing your favorite autonomous AI tool? Send us a note and we&apos;ll review the listing.
          </p>
          <div className="mt-6">
            {suggestionEmail ? (
              <SuggestAgentCTA email={suggestionEmail} />
            ) : (
              <p className="text-sm text-foreground-secondary">Suggestion email not configured.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
