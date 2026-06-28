"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { Search, Star, Tag, PenTool } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  items: MarketplaceItem[];
}

const categoryBaseColors: Record<string, string> = {
  Agent: "cyan",
  Service: "amber",
  Hardware: "amber",
  Tool: "emerald",
};

const categoryColors: Record<string, string> = {
  Agent: "text-cyan border-cyan/30 bg-cyan/5",
  Service: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Hardware: "text-amber border-amber/30 bg-amber/5",
  Tool: "text-emerald border-emerald/30 bg-emerald/5",
};

const categoryTextColors: Record<string, string> = {
  Agent: "text-cyan",
  Service: "text-amber-400",
  Hardware: "text-amber",
  Tool: "text-emerald",
};

const categoryBorderColors: Record<string, string> = {
  Agent: "border-l-cyan",
  Service: "border-l-amber-400",
  Hardware: "border-l-amber",
  Tool: "border-l-emerald",
};

const categoryGlowColors: Record<string, string> = {
  Agent: "rgba(34,211,238,0.35)",
  Service: "rgba(139,92,246,0.35)",
  Hardware: "rgba(245,158,11,0.35)",
  Tool: "rgba(16,185,129,0.35)",
};

const categoryGradientColors: Record<string, string> = {
  Agent: "from-cyan-500/25 via-cyan-500/10 to-transparent",
  Service: "from-amber-500/25 via-amber-500/10 to-transparent",
  Hardware: "from-amber-500/25 via-amber-500/10 to-transparent",
  Tool: "from-emerald-500/25 via-emerald-500/10 to-transparent",
};

export default function ReviewsDirectoryClient({ items }: Props) {
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
            <PenTool className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">SMF Reviews</h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
            Hands-on reviews of AI agents, tools, services, and hardware from the SMF Works team.
            Independent takes with honest limitations, not affiliate copy.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {/* Category filters */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
            <Tag className={`relative h-5 w-5 ${activeCategory === "All" ? "text-accent" : "text-foreground-tertiary"}`} />
            <div className="relative">
              <span className="block text-sm font-medium text-foreground">All reviews</span>
              <span className="text-xs text-foreground-secondary">{items.length} total</span>
            </div>
          </button>
          {categories.map((cat) => {
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
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryGradientColors[cat] || "from-amber-500/25 via-amber-500/10 to-transparent"} opacity-0 transition-opacity ${
                    activeCategory === cat ? "opacity-40" : "group-hover:opacity-20"
                  }`}
                />
                <span className={`relative ${activeCategory === cat ? "text-inherit" : "text-foreground-tertiary"}`}>
                  <Star className="h-5 w-5" />
                </span>
                <div className="relative">
                  <span className="block text-sm font-medium text-foreground">{cat}</span>
                  <span className="text-xs text-foreground-secondary">{items.filter((i) => i.category === cat).length} reviews</span>
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
              placeholder="Search reviews by product, category, or tag..."
              className="w-full rounded-lg border border-hairline bg-canvas pl-10 pr-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>

        <p className="mb-6 text-sm text-foreground-secondary font-mono">
          Showing {filtered.length} of {items.length} reviews
        </p>

        {/* Review cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const colorClass = categoryColors[item.category] || "border-hairline bg-panel";
            const textColor = categoryTextColors[item.category] || "text-accent";
            const leftBorder = categoryBorderColors[item.category] || "border-l-transparent";
            const rating = typeof item.rating === "number" ? item.rating : undefined;
            return (
              <Link
                key={item.slug}
                href={`/reviews/${item.slug}`}
                className={`group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-current hover:bg-elevated/50 border-l-4 ${leftBorder}`}
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 40px -12px ${categoryGlowColors[item.category] || "rgba(245,158,11,0.18)"}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
                }}
              >
                <div className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
                  <Tag className="h-3 w-3" />
                  {item.category}
                </div>
                <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-cyan">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary">
                  {item.excerpt}
                </p>
                {rating !== undefined && (
                  <div className="mt-4 flex items-center gap-1 text-sm">
                    <span className={`font-medium ${textColor}`}>{rating.toFixed(1)}</span>
                    <span className="text-foreground-tertiary">/ 5</span>
                  </div>
                )}
                {item.last_verified && (
                  <div className="mt-4">
                    <FreshnessBadge dateString={item.last_verified} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
