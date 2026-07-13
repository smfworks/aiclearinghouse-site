"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { Search, ArrowRight, Lightbulb, Workflow, Shield, DollarSign, CheckCircle, Wrench, Zap } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  items: MarketplaceItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Workflow: <Workflow className="h-4 w-4" />,
  Quality: <CheckCircle className="h-4 w-4" />,
  Safety: <Shield className="h-4 w-4" />,
  Cost: <DollarSign className="h-4 w-4" />,
  Hermes: <Zap className="h-4 w-4" />,
  Tip: <Lightbulb className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  Workflow: "text-cyan border-cyan/30 bg-cyan/5",
  Quality: "text-emerald border-emerald/30 bg-emerald/5",
  Safety: "text-rose border-rose/30 bg-rose/5",
  Cost: "text-amber border-amber/30 bg-amber/5",
  Hermes: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Tip: "text-accent border-accent/30 bg-accent/5",
};

const categoryTextColors: Record<string, string> = {
  Workflow: "text-cyan",
  Quality: "text-emerald",
  Safety: "text-rose",
  Cost: "text-amber",
  Hermes: "text-amber-400",
  Tip: "text-accent",
};

const categoryBorderColors: Record<string, string> = {
  Workflow: "border-l-cyan",
  Quality: "border-l-emerald",
  Safety: "border-l-rose",
  Cost: "border-l-amber",
  Hermes: "border-l-amber-400",
  Tip: "border-l-accent",
};

const categoryGlowColors: Record<string, string> = {
  Workflow: "rgba(34,211,238,0.35)",
  Quality: "rgba(16,185,129,0.35)",
  Safety: "rgba(244,63,94,0.35)",
  Cost: "rgba(245,158,11,0.35)",
  Hermes: "rgba(139,92,246,0.35)",
  Tip: "rgba(var(--color-accent-rgb),0.35)",
};

const categoryGradientColors: Record<string, string> = {
  Workflow: "from-cyan-500/25 via-cyan-500/10 to-transparent",
  Quality: "from-emerald-500/25 via-emerald-500/10 to-transparent",
  Safety: "from-rose-500/25 via-rose-500/10 to-transparent",
  Cost: "from-amber-500/25 via-amber-500/10 to-transparent",
  Hermes: "from-amber-500/25 via-amber-500/10 to-transparent",
  Tip: "from-accent/25 via-accent/10 to-transparent",
};

export default function TipsDirectoryClient({ items }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category))).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let base = [...items].sort((a, b) => {
      const aDate = a.last_verified ? new Date(String(a.last_verified)).getTime() : 0;
      const bDate = b.last_verified ? new Date(String(b.last_verified)).getTime() : 0;
      return bDate - aDate;
    });
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
            <Lightbulb className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Tips & Tricks</h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
            Practical habits that make agents safer, cheaper, and more useful. Short reads, long payoff.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {/* Category filters */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <Lightbulb className={`relative h-5 w-5 ${activeCategory === "All" ? "text-accent" : "text-foreground-tertiary"}`} />
            <div className="relative">
              <span className="block text-sm font-medium text-foreground">All tips</span>
              <span className="text-xs text-foreground-secondary">{items.length} total</span>
            </div>
          </button>
          {categories.map((cat) => {
            const colorClass = categoryColors[cat] || categoryColors.Tip;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all ${
                  activeCategory === cat
                    ? `${colorClass} border-current`
                    : "border-hairline bg-panel hover:border-hairline-strong"
                }`}
              >
                {/* subtle category gradient on hover / active */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryGradientColors[cat] || categoryGradientColors.Tip} opacity-0 transition-opacity ${
                    activeCategory === cat ? "opacity-40" : "group-hover:opacity-20"
                  }`}
                />
                <span className={`relative ${activeCategory === cat ? "text-inherit" : "text-foreground-tertiary"}`}>
                  {categoryIcons[cat] || <Lightbulb className="h-5 w-5" />}
                </span>
                <div className="relative">
                  <span className="block text-sm font-medium text-foreground">{cat}</span>
                  <span className="text-xs text-foreground-secondary">{items.filter((i) => i.category === cat).length} tips</span>
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
              placeholder="Search tips by keyword, tag, or category..."
              className="w-full rounded-lg border border-hairline bg-canvas pl-10 pr-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>

        <p className="mb-6 text-sm text-foreground-secondary font-mono">
          Showing {filtered.length} of {items.length} tips
        </p>

        {/* Tip cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const colorClass = categoryColors[item.category] || categoryColors.Tip;
            const textColor = categoryTextColors[item.category] || categoryTextColors.Tip;
            const leftBorder = categoryBorderColors[item.category] || categoryBorderColors.Tip;
            return (
              <Link
                key={item.slug}
                href={`/tips/${item.slug}`}
                className={`group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-panel p-6 transition-all hover:-translate-y-0.5 hover:bg-elevated/50 border-l-4 ${leftBorder}`}
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 40px -12px ${categoryGlowColors[item.category] || categoryGlowColors.Tip}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
                }}
              >
                {/* strong top gradient */}
                <div
                  className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${categoryGradientColors[item.category] || categoryGradientColors.Tip} opacity-80 pointer-events-none`}
                />
                <div className="relative mb-4 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}>
                    {categoryIcons[item.category] && <span className="h-3.5 w-3.5">{categoryIcons[item.category]}</span>}
                    {item.category}
                  </span>
                  {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
                </div>

                <h2 className={`relative text-lg font-semibold text-foreground transition-colors group-hover:${textColor}`}>
                  {item.title}
                </h2>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">{item.excerpt}</p>

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

                <div className={`relative mt-5 flex items-center text-sm font-medium transition-colors ${textColor}`}>
                  Read tip
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <p className="text-foreground-secondary">No tips match your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
