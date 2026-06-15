"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { getSectionTitle } from "@/lib/marketplace/types";
import { ArrowRight, Search } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  items: MarketplaceItem[];
  section: string;
  title: string;
  description: string;
}

export default function SectionDirectoryClient({ items, section, title, description }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = Array.from(new Set(items.map((i) => i.category))).sort();
  const filtered = items.filter((i) => {
    const q = search.toLowerCase();
    const matchesSearch =
      i.title.toLowerCase().includes(q) ||
      i.excerpt.toLowerCase().includes(q) ||
      i.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = category === "All" || i.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
        <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Link href="/" className="text-sm text-foreground-secondary transition-colors hover:text-foreground">
            ← Home
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">{description}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="mb-8 rounded-xl border border-hairline bg-panel p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title, tag, keyword..."
                  className="w-full rounded-lg border border-hairline bg-canvas pl-9 pr-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
              >
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm text-foreground-secondary font-mono">
          Showing {filtered.length} of {items.length}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/${section}/${item.slug}`}
              className="group flex flex-col rounded-xl border border-hairline bg-panel p-5 transition-all hover:border-hairline-strong hover:bg-elevated"
            >
              {item.image && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg border border-hairline">
                  <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                </div>
              )}
              <span className="text-xs font-medium uppercase tracking-wider text-accent font-mono">
                {item.category}
              </span>
              <h2 className="mt-2 text-lg font-medium text-foreground transition-colors group-hover:text-accent">
                {item.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">{item.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-hairline px-2 py-0.5 text-xs text-foreground-tertiary">
                    {tag}
                  </span>
                ))}
              </div>
              {item.last_verified && (
                <div className="mt-3">
                  <FreshnessBadge dateString={item.last_verified} />
                </div>
              )}
              <div className="mt-4 flex items-center text-sm font-medium text-accent">
                Read <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <p className="text-foreground-secondary">No items match your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
