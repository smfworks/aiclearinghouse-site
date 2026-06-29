"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { Search, ArrowRight, Clock, Server, Database, Shield, BarChart3, Mic, Layers } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  items: MarketplaceItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Infrastructure: <Server className="h-5 w-5" />,
  Data: <Database className="h-5 w-5" />,
  Security: <Shield className="h-5 w-5" />,
  Operations: <BarChart3 className="h-5 w-5" />,
  "AI APIs": <Mic className="h-5 w-5" />,
};

const categoryBaseColors: Record<string, string> = {
  Infrastructure: "cyan",
  Data: "emerald",
  Security: "rose",
  Operations: "amber",
  "AI APIs": "amber",
};

const categoryColors: Record<string, string> = {
  Infrastructure: "text-cyan border-cyan/30 bg-cyan/5",
  Data: "text-emerald border-emerald/30 bg-emerald/5",
  Security: "text-rose border-rose/30 bg-rose/5",
  Operations: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  "AI APIs": "text-amber border-amber/30 bg-amber/5",
};

const categoryTextColors: Record<string, string> = {
  Infrastructure: "text-cyan",
  Data: "text-emerald",
  Security: "text-rose",
  Operations: "text-amber-400",
  "AI APIs": "text-amber",
};

const categoryBorderColors: Record<string, string> = {
  Infrastructure: "border-l-cyan",
  Data: "border-l-emerald",
  Security: "border-l-rose",
  Operations: "border-l-amber-400",
  "AI APIs": "border-l-amber",
};

const categoryGlowColors: Record<string, string> = {
  Infrastructure: "rgba(34,211,238,0.35)",
  Data: "rgba(16,185,129,0.35)",
  Security: "rgba(244,63,94,0.35)",
  Operations: "rgba(139,92,246,0.35)",
  "AI APIs": "rgba(245,158,11,0.35)",
};

const categoryGradientColors: Record<string, string> = {
  Infrastructure: "from-cyan-500/25 via-cyan-500/10 to-transparent",
  Data: "from-emerald-500/25 via-emerald-500/10 to-transparent",
  Security: "from-rose-500/25 via-rose-500/10 to-transparent",
  Operations: "from-amber-500/25 via-amber-500/10 to-transparent",
  "AI APIs": "from-amber-500/25 via-amber-500/10 to-transparent",
};

export default function ServicesDirectoryClient({ items }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category))).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let base = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    if (activeCategory !== "All") {
      base = base.filter((i) => i.category === activeCategory);
    }
    return base.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.excerpt.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
    );
  }, [items, search, activeCategory]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
        <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Link href="/" className="text-sm text-foreground-secondary transition-colors hover:text-foreground">
            ← Home
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <Layers className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Services</h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
            Curated infrastructure, data, security, and API services that power production AI agents.
            Not a marketplace catalog — a shortlist of tools we would actually wire into a stack.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {/* Category filters */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <button
            onClick={() => setActiveCategory("All")}
            className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all ${
              activeCategory === "All"
                ? "border-accent bg-accent/10"
                : "border-hairline bg-panel hover:border-hairline-strong"
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent transition-opacity ${
                activeCategory === "All" ? "opacity-40" : "opacity-0 group-hover:opacity-20"
              }`}
            />
            <Layers className={`relative h-5 w-5 ${activeCategory === "All" ? "text-accent" : "text-foreground-tertiary"}`} />
            <div className="relative">
              <span className="block text-sm font-medium text-foreground">All services</span>
              <span className="text-xs text-foreground-secondary">{items.length} total</span>
            </div>
          </button>
          {categories.map((cat) => {
            const base = categoryBaseColors[cat] || "accent";
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all ${
                  activeCategory === cat
                    ? `${categoryColors[cat]} border-current`
                    : "border-hairline bg-panel hover:border-hairline-strong"
                }`}
              >
                {/* subtle category gradient on hover / active */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryGradientColors[cat] || "from-amber-500/25 via-amber-500/10 to-transparent"} opacity-0 transition-opacity ${
                    activeCategory === cat ? "opacity-40" : "group-hover:opacity-20"
                  }`}
                />
                <span className={`relative ${activeCategory === cat ? "text-inherit" : "text-foreground-tertiary"}`}>
                  {categoryIcons[cat] || <Layers className="h-5 w-5" />}
                </span>
                <div className="relative">
                  <span className="block text-sm font-medium text-foreground">{cat}</span>
                  <span className="text-xs text-foreground-secondary">{items.filter((i) => i.category === cat).length} services</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-8 rounded-xl border border-hairline bg-panel p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services by name, provider, or use case..."
              className="w-full rounded-lg border border-hairline bg-canvas pl-10 pr-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>

        <p className="mb-6 text-sm text-foreground-secondary font-mono">
          Showing {filtered.length} of {items.length} services
        </p>

        {/* Service cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const colorClass = categoryColors[item.category] || "border-hairline bg-panel";
            const textColor = categoryTextColors[item.category] || "text-accent";
            const leftBorder = categoryBorderColors[item.category] || "border-l-transparent";
            return (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className={`group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-current hover:bg-elevated/50 border-l-4 ${leftBorder}`}
                style={{
                  boxShadow: `0 0 0 0 transparent`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 40px -12px ${categoryGlowColors[item.category] || "rgba(245,158,11,0.18)"}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0 transparent`;
                }}
              >
                {/* strong top gradient */}
                <div
                  className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${categoryGradientColors[item.category] || "from-amber-500/25 via-amber-500/10 to-transparent"} opacity-80 pointer-events-none`}
                />
                <div className="relative mb-4 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}>
                    {categoryIcons[item.category] && <span className="h-3.5 w-3.5">{categoryIcons[item.category]}</span>}
                    {item.category}
                  </span>
                  <span className={`text-xs font-mono ${textColor}`}>{item.pricing_model || item.pricing || ""}</span>
                </div>

                <h2 className={`relative text-lg font-semibold text-foreground transition-colors group-hover:${textColor}`}>
                  {item.title}
                </h2>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">{item.excerpt}</p>

                <div className="relative mt-5 flex flex-wrap items-center gap-3 text-xs text-foreground-tertiary">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    Verified {item.last_verified || "recently"}
                  </span>
                </div>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  {item.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border border-hairline px-2 py-0.5 text-xs transition-colors group-hover:${textColor} group-hover:border-current/30`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={`relative mt-5 flex items-center text-sm font-medium transition-colors ${textColor}`}
                >
                  Read review
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <p className="text-foreground-secondary">No services match your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
