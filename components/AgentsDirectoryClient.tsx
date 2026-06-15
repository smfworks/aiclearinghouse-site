"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-hairline px-6 py-20 md:py-28">
        <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
            The Autonomous AI Directory
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Agent Directory</h1>
          <p className="mt-5 text-lg text-foreground-secondary md:text-xl">
            Compare autonomous AI agents side-by-side. Find the right coding agent, orchestrator, or multi-platform assistant.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-hairline bg-panel p-4">
              <p className="text-3xl font-medium text-accent font-mono">{stats.total}</p>
              <p className="text-sm text-foreground-secondary">Agents listed</p>
            </div>
            <div className="rounded-xl border border-hairline bg-panel p-4">
              <p className="text-3xl font-medium text-success font-mono">{stats.openSource}</p>
              <p className="text-sm text-foreground-secondary">Open source</p>
            </div>
            <div className="rounded-xl border border-hairline bg-panel p-4">
              <p className="text-3xl font-medium text-warning font-mono">{stats.multiPlatform}</p>
              <p className="text-sm text-foreground-secondary">Multi-platform</p>
            </div>
            <div className="rounded-xl border border-hairline bg-panel p-4">
              <p className="text-3xl font-medium text-foreground font-mono">{stats.providerAgnostic}</p>
              <p className="text-sm text-foreground-secondary">Provider-agnostic</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="mb-8 rounded-xl border border-hairline bg-panel p-5">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, company, category..."
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="All">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Runtime</label>
              <select
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="All">Any runtime</option>
                {runtimes.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Pricing</label>
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="All">Any pricing</option>
                {pricings.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-sm text-foreground transition-colors hover:border-hairline-strong">
                <input
                  type="checkbox"
                  checked={openSourceOnly}
                  onChange={(e) => setOpenSourceOnly(e.target.checked)}
                  className="accent-accent"
                />
                Open source only
              </label>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-foreground-secondary font-mono">
            Showing {filtered.length} of {agents.length} agents
          </p>
          {selected.size > 0 && (
            <button
              onClick={() => setCompareOpen(true)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Compare ({selected.size})
            </button>
          )}
        </div>

        {compareOpen && (
          <AgentComparison agents={agents.filter((a) => selected.has(a.id))} onClose={() => setCompareOpen(false)} />
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
              className="mt-4 text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Suggest an Agent</h2>
          <p className="mt-2 text-foreground-secondary">
            Missing your favorite autonomous AI tool? Submit it and we&apos;ll review the listing.
          </p>
          <div className="mt-6">
            <SubmitAgentForm issueUrl={GITHUB_ISSUE_URL} />
          </div>
        </div>
      </section>
    </div>
  );
}
