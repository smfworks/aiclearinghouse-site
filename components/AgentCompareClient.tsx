"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { AgentProfile } from "@/lib/marketplace/types";
import { Check, X, ArrowLeft, Scale, Sparkles } from "lucide-react";

interface Props {
  agents: AgentProfile[];
  selected: AgentProfile[];
}

const MAX_COMPARE = 4;

const rows = [
  { key: "company", label: "Company", format: (a: AgentProfile) => a.company },
  { key: "pricing", label: "Pricing", format: (a: AgentProfile) => a.pricing },
  { key: "runtime", label: "Runtime", format: (a: AgentProfile) => a.runtime },
  { key: "openSource", label: "Open source", format: (a: AgentProfile) => (a.openSource ? "Yes" : "No") },
  { key: "multiPlatform", label: "Multi-platform", format: (a: AgentProfile) => (a.multiPlatform ? "Yes" : "No") },
  { key: "providerAgnostic", label: "Provider-agnostic", format: (a: AgentProfile) => (a.providerAgnostic ? "Yes" : "No") },
  { key: "model", label: "Default model", format: (a: AgentProfile) => a.model || "—" },
  { key: "platforms", label: "Platforms", format: (a: AgentProfile) => a.platforms.join(", ") || "—" },
  { key: "releaseYear", label: "Release year", format: (a: AgentProfile) => String(a.releaseYear) },
];

export default function AgentCompareClient({ agents, selected }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(selected.map((a) => a.id))
  );
  const [search, setSearch] = useState("");

  const selectedAgents = useMemo(
    () => agents.filter((a) => selectedIds.has(a.id)),
    [agents, selectedIds]
  );

  const filteredAgents = useMemo(() => {
    const q = search.toLowerCase();
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [agents, search]);

  function toggle(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (next.size >= MAX_COMPARE) return;
      next.add(id);
    }
    setSelectedIds(next);
    const ids = Array.from(next).join(",");
    const params = new URLSearchParams(searchParams.toString());
    if (ids) {
      params.set("ids", ids);
    } else {
      params.delete("ids");
    }
    router.replace(`/agents/compare?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
        <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Agent directory
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Compare Agents</h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
            Select up to {MAX_COMPARE} agents and compare them side-by-side by runtime, pricing, platforms, and features.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="mb-8 rounded-xl border border-hairline bg-panel p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Search agents
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, company, category..."
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent md:w-80"
              />
            </div>
            <div className="text-sm text-foreground-secondary">
              {selectedIds.size} of {MAX_COMPARE} selected
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filteredAgents.map((agent) => {
              const isSelected = selectedIds.has(agent.id);
              const disabled = !isSelected && selectedIds.size >= MAX_COMPARE;
              return (
                <button
                  key={agent.id}
                  onClick={() => toggle(agent.id)}
                  disabled={disabled}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-accent bg-accent/10 text-accent"
                      : disabled
                        ? "border-hairline bg-canvas text-foreground-tertiary cursor-not-allowed"
                        : "border-hairline bg-canvas text-foreground hover:border-hairline-strong"
                  }`}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                  {agent.name}
                </button>
              );
            })}
          </div>
        </div>

        {selectedAgents.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-hairline bg-panel">
            <div className="grid" style={{ gridTemplateColumns: `180px repeat(${selectedAgents.length}, minmax(200px, 1fr))` }}>
              {/* Header row */}
              <div className="border-b border-r border-hairline bg-elevated p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground-tertiary">
                  <Scale className="h-4 w-4" />
                  <span className="font-mono text-xs uppercase tracking-wider">Compare</span>
                </div>
              </div>
              {selectedAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="border-b border-r border-hairline bg-elevated p-4 last:border-r-0"
                >
                  <Link href={`/agents/${agent.id}`} className="group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-sm font-medium text-foreground">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground transition-colors group-hover:text-accent">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-foreground-secondary">{agent.company}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Feature rows */}
              {rows.map((row) => (
                <>
                  <div
                    key={`label-${row.key}`}
                    className="border-b border-r border-hairline p-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono"
                  >
                    {row.label}
                  </div>
                  {selectedAgents.map((agent, idx) => (
                    <div
                      key={`value-${row.key}-${agent.id}`}
                      className={`border-b border-r border-hairline p-4 text-sm text-foreground ${
                        idx === selectedAgents.length - 1 ? "last:border-r-0" : ""
                      }`}
                    >
                      {row.format(agent)}
                    </div>
                  ))}
                </>
              ))}

              {/* Features list row */}
              <div className="border-b border-r border-hairline p-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Key features
              </div>
              {selectedAgents.map((agent, idx) => (
                <div
                  key={`features-${agent.id}`}
                  className={`border-b border-r border-hairline p-4 text-sm text-foreground ${
                    idx === selectedAgents.length - 1 ? "last:border-r-0" : ""
                  }`}
                >
                  <ul className="space-y-1.5">
                    {agent.features.slice(0, 6).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Tag row */}
              <div className="border-b border-r border-hairline p-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Categories
              </div>
              {selectedAgents.map((agent, idx) => (
                <div
                  key={`cats-${agent.id}`}
                  className={`border-b border-r border-hairline p-4 ${
                    idx === selectedAgents.length - 1 ? "last:border-r-0" : ""
                  }`}
                >
                  <div className="flex flex-wrap gap-2">
                    {agent.categories.map((c) => (
                      <span key={c} className="rounded-full border border-hairline px-2 py-0.5 text-xs text-foreground-secondary">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Description row */}
              <div className="border-r border-hairline bg-elevated p-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                One-line verdict
              </div>
              {selectedAgents.map((agent, idx) => (
                <div
                  key={`desc-${agent.id}`}
                  className={`border-r border-hairline bg-elevated p-4 text-sm text-foreground-secondary ${
                    idx === selectedAgents.length - 1 ? "last:border-r-0" : ""
                  }`}
                >
                  {agent.tagline}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <Scale className="mx-auto h-10 w-10 text-foreground-tertiary" />
            <h2 className="mt-4 text-xl font-medium text-foreground">No agents selected</h2>
            <p className="mt-2 text-foreground-secondary">
              Search above and select up to {MAX_COMPARE} agents to compare.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
