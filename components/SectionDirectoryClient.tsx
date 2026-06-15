"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { getSectionTitle } from "@/lib/marketplace/types";

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
    const matchesSearch = i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = category === "All" || i.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden border-b border-border px-6 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← Home</Link>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl flex-1 px-6 py-12">
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, tag, keyword..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary">
                <option value="All">All</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">Showing {filtered.length} of {items.length}</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/${section}/${item.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-sm"
            >
              {item.image && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                </div>
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.category}</span>
              <h2 className="mt-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">{tag}</span>
                ))}
              </div>
              {item.last_verified && <p className="mt-3 text-xs text-muted-foreground">Verified {item.last_verified}</p>}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No items match your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
