"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { LLMModel } from "@/lib/marketplace/types";
import { formatPrice, formatNumber } from "@/lib/marketplace/format";
import { Check, ArrowLeft, Scale, Cpu, Database, Zap } from "lucide-react";

interface Props {
  models: (LLMModel & { providerId: string; providerName: string; providerIcon: string })[];
  providers: { id: string; name: string; icon: string }[];
  selected: (LLMModel & { providerId: string; providerName: string; providerIcon: string })[];
}

const MAX_COMPARE = 4;

const rows: {
  key: string;
  label: string;
  icon?: React.ReactNode;
  format: (m: LLMModel & { providerId: string; providerName: string; providerIcon: string }) => React.ReactNode;
}[] = [
  { key: "provider", label: "Provider", format: (m) => m.providerName },
  {
    key: "input",
    label: "Input / 1M tokens",
    format: (m) => formatPrice(m.input_price),
  },
  {
    key: "output",
    label: "Output / 1M tokens",
    format: (m) => formatPrice(m.output_price),
  },
  {
    key: "cached",
    label: "Cached input",
    format: (m) => formatPrice(m.cached_input_price),
  },
  {
    key: "context",
    label: "Context window",
    icon: <Database className="h-3.5 w-3.5" />,
    format: (m) => (m.context_window ? formatNumber(m.context_window) : "—"),
  },
  {
    key: "maxout",
    label: "Max output",
    format: (m) => (m.max_output_tokens ? formatNumber(m.max_output_tokens) : "—"),
  },
  {
    key: "mmlu",
    label: "MMLU",
    format: (m) => m.mmlu ?? "—",
  },
  {
    key: "humaneval",
    label: "HumanEval",
    format: (m) => m.humaneval ?? "—",
  },
  {
    key: "arena",
    label: "Chatbot Arena",
    format: (m) => m.chatbot_arena ?? "—",
  },
  {
    key: "category",
    label: "Category",
    format: (m) => m.category || "—",
  },
  {
    key: "released",
    label: "Released",
    format: (m) => m.release_date || "—",
  },
];

export default function LLMCompareClient({ models, providers, selected }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(selected.map((m) => `${m.providerId}:${m.model_id}`))
  );
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(models.map((m) => m.category).filter(Boolean))).sort(),
    [models]
  );

  const selectedModels = useMemo(
    () => models.filter((m) => selectedIds.has(`${m.providerId}:${m.model_id}`)),
    [models, selectedIds]
  );

  const filteredModels = useMemo(() => {
    const q = search.toLowerCase();
    return models.filter((m) => {
      const matchesSearch =
        m.model.toLowerCase().includes(q) ||
        m.providerName.toLowerCase().includes(q) ||
        m.model_id.toLowerCase().includes(q);
      const matchesProvider = providerFilter === "all" || m.providerId === providerFilter;
      const matchesCategory = categoryFilter === "all" || m.category === categoryFilter;
      return matchesSearch && matchesProvider && matchesCategory;
    });
  }, [models, search, providerFilter, categoryFilter]);

  function toggle(providerId: string, modelId: string) {
    const id = `${providerId}:${modelId}`;
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
    router.replace(`/llms/compare?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
        <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            href="/llms"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            LLM directory
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Compare LLMs</h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
            Select up to {MAX_COMPARE} models and compare pricing, context windows, and benchmarks side-by-side.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {/* Selector panel */}
        <div className="mb-8 rounded-xl border border-hairline bg-panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Search models
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Model name, provider, API ID..."
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Provider
              </label>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent lg:w-44"
              >
                <option value="all">All providers</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent lg:w-44"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-foreground-secondary font-mono">
              {selectedIds.size} of {MAX_COMPARE} selected
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filteredModels.slice(0, 60).map((m) => {
              const id = `${m.providerId}:${m.model_id}`;
              const isSelected = selectedIds.has(id);
              const disabled = !isSelected && selectedIds.size >= MAX_COMPARE;
              return (
                <button
                  key={id}
                  onClick={() => toggle(m.providerId, m.model_id)}
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
                  <span className="truncate max-w-[160px]">{m.model}</span>
                  <span className="text-xs text-foreground-tertiary">· {m.providerName}</span>
                </button>
              );
            })}
            {filteredModels.length > 60 && (
              <span className="self-center text-xs text-foreground-tertiary">
                +{filteredModels.length - 60} more — refine filters to see all
              </span>
            )}
          </div>
        </div>

        {/* Comparison table */}
        {selectedModels.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-hairline bg-panel">
            <div
              className="grid overflow-x-auto"
              style={{
                gridTemplateColumns: `180px repeat(${selectedModels.length}, minmax(200px, 1fr))`,
              }}
            >
              {/* Header row */}
              <div className="border-b border-r border-hairline bg-elevated p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground-tertiary">
                  <Scale className="h-4 w-4" />
                  <span className="font-mono text-xs uppercase tracking-wider">Compare</span>
                </div>
              </div>
              {selectedModels.map((m, idx) => (
                <div
                  key={`header-${m.model_id}`}
                  className={`border-b border-r border-hairline bg-elevated p-4 ${
                    idx === selectedModels.length - 1 ? "last:border-r-0" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-canvas">
                      <Image src={m.providerIcon} alt={m.providerName} fill className="object-contain p-1" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-foreground">{m.model}</h3>
                      <p className="text-xs text-foreground-secondary">{m.providerName}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Spec rows */}
              {rows.map((row) => (
                <>
                  <div
                    key={`label-${row.key}`}
                    className="border-b border-r border-hairline p-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono"
                  >
                    <div className="flex items-center gap-2">
                      {row.icon}
                      {row.label}
                    </div>
                  </div>
                  {selectedModels.map((m, idx) => (
                    <div
                      key={`value-${row.key}-${m.model_id}`}
                      className={`border-b border-r border-hairline p-4 text-sm text-foreground ${
                        idx === selectedModels.length - 1 ? "last:border-r-0" : ""
                      }`}
                    >
                      {row.format(m)}
                    </div>
                  ))}
                </>
              ))}

              {/* Description row */}
              <div className="border-r border-hairline bg-elevated p-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" />
                  Verdict
                </div>
              </div>
              {selectedModels.map((m, idx) => (
                <div
                  key={`desc-${m.model_id}`}
                  className={`border-r border-hairline bg-elevated p-4 text-sm text-foreground-secondary ${
                    idx === selectedModels.length - 1 ? "last:border-r-0" : ""
                  }`}
                >
                  {m.description || "—"}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <Scale className="mx-auto h-10 w-10 text-foreground-tertiary" />
            <h2 className="mt-4 text-xl font-medium text-foreground">No models selected</h2>
            <p className="mt-2 text-foreground-secondary">
              Search above and select up to {MAX_COMPARE} models to compare.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}