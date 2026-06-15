"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AgentCard from "@/components/AgentCard";
import AgentComparison from "@/components/AgentComparison";
import SubmitAgentForm from "@/components/SubmitAgentForm";
import { AgentProfile } from "@/lib/marketplace/types";

interface Props {
  agents: AgentProfile[];
  categories: string[];
  runtimes: string[];
  pricings: string[];
}

const GITHUB_ISSUE_URL = "https://github.com/smfworks/aiclearinghouse-site/issues/new";
const MAX_COMPARE = 3;

export default function AgentsDirectoryClient({ agents, categories, runtimes, pricings }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCompare = searchParams.get("compare");
  const initialSelected = new Set(
    initialCompare
      ? initialCompare
          .split(",")
          .map((s) => s.trim())
          .filter((s) => agents.some((a) => a.id === s))
      : []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [runtime, setRuntime] = useState("All");
  const [pricing, setPricing] = useState("All");
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(initialSelected);
  const [compareOpen, setCompareOpen] = useState(initialSelected.size > 0);

  useEffect(() => {
    const ids = Array.from(selected).join(",");
    const params = new URLSearchParams(searchParams.toString());
    if (ids) {
      params.set("compare", ids);
    } else {
      params.delete("compare");
    }
    const url = ids ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  }, [selected, pathname, router, searchParams]);

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
    multiPlatform: agents.filter((a) => a.multiPlatform).length,
    providerAgnostic: agents.filter((a) => a.providerAgnostic).length,
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

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden border-b border-border px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            The Autonomous AI Directory
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">Agent Directory</h1>
          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            Compare autonomous AI agents side-by-side. Find the right coding agent, orchestrator, or multi-platform assistant.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-card/80 p-4">
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Agents listed</p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 p-4">
              <p className="text-3xl font-bold text-emerald-500">{stats.openSource}</p>
              <p className="text-sm text-muted-foreground">Open source</p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 p-4">
              <p className="text-3xl font-bold text-orange-500">{stats.multiPlatform}</p>
              <p className="text-sm text-muted-foreground">Multi-platform</p>
            </div>
            <div className="rounded-xl border border-border bg-card/80 p-4">
              <p className="text-3xl font-bold text-purple-500">{stats.providerAgnostic}</p>
              <p className="text-sm text-muted-foreground">Provider-agnostic</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl flex-1 px-6 py-12">
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, company, category..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary">
                <option value="All">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Runtime</label>
              <select value={runtime} onChange={(e) => setRuntime(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary">
                <option value="All">Any runtime</option>
                {runtimes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Pricing</label>
              <select value={pricing} onChange={(e) => setPricing(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary">
                <option value="All">Any pricing</option>
                {pricings.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground hover:border-primary">
                <input type="checkbox" checked={openSourceOnly} onChange={(e) => setOpenSourceOnly(e.target.checked)} className="accent-primary" />
                Open source only
              </label>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {agents.length} agents</p>
          {selected.size > 0 && (
            <button onClick={() => setCompareOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Compare ({selected.size})
            </button>
          )}
        </div>

        {compareOpen && (
          <AgentComparison agents={agents.filter((a) => selected.has(a.id))} onClose={() => setCompareOpen(false)} />
        )}

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">No agents match your filters.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); setRuntime("All"); setPricing("All"); setOpenSourceOnly(false); }}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">Suggest an Agent</h2>
          <p className="mt-2 text-muted-foreground">Missing your favorite autonomous AI tool? Submit it and we&apos;ll review the listing.</p>
          <div className="mt-6">
            <SubmitAgentForm issueUrl={GITHUB_ISSUE_URL} />
          </div>
        </div>
      </section>
    </div>
  );
}
