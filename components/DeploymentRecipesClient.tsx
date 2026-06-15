"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MarketplaceItem } from "@/lib/marketplace/types";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  Terminal,
  Zap,
  Cpu,
  Flame,
  Layers,
  Rocket,
  Check,
  ExternalLink,
} from "lucide-react";

interface Props {
  items: MarketplaceItem[];
}

const quickFilters = [
  { label: "Local-first", tag: "local-llm" },
  { label: "Open source", tag: "open-source" },
  { label: "Docker", tag: "docker" },
  { label: "VS Code", tag: "vscode" },
];

export default function DeploymentRecipesClient({ items }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    const q = query.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    const matchesTag = !activeTag || item.tags.some((t) => t.toLowerCase() === activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
        <div className="bg-grid-glow absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-canvas/90 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-panel/80 px-4 py-1.5 text-xs font-medium text-foreground-secondary shadow-[0_0_20px_-8px_var(--accent-glow)]">
            <Terminal className="h-3.5 w-3.5 text-amber" />
            Tested commands, real outputs
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Deployment Recipes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground-secondary md:text-xl">
            Copy-paste setups that actually work. No marketing, no missing prerequisites, no "it should work on your machine." Just the commands, the expected output, and the fixes when something goes wrong.
          </p>
        </div>
      </section>

      {/* Search + filters */}
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="rounded-xl border border-hairline bg-panel p-5 shadow-[0_0_30px_-12px_rgba(0,0,0,0.5)]">
          <div className="grid gap-4 md:grid-cols-[1fr,auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes, tools, tags..."
                className="w-full rounded-lg border border-hairline bg-canvas pl-9 pr-4 py-2.5 text-foreground outline-none transition-all focus:border-amber focus:ring-1 focus:ring-amber/50"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {quickFilters.map((f) => (
                <button
                  key={f.tag}
                  onClick={() => setActiveTag(activeTag === f.tag ? null : f.tag)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    activeTag === f.tag
                      ? "border-amber bg-amber/10 text-amber"
                      : "border-hairline text-foreground-secondary hover:border-amber/50 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recipe grid */}
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
            {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
          </p>
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="text-xs text-amber hover:text-accent"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const difficulty = String(item.difficulty || "Intermediate");
            const difficultyColor =
              difficulty === "Beginner" || difficulty === "Easy"
                ? "text-emerald border-emerald/30 bg-emerald/5"
                : difficulty === "Advanced"
                ? "text-rose border-rose/30 bg-rose/5"
                : "text-amber border-amber/30 bg-amber/5";
            const textColor =
              difficulty === "Beginner" || difficulty === "Easy"
                ? "text-emerald"
                : difficulty === "Advanced"
                ? "text-rose"
                : "text-amber";

            return (
              <Link
                key={item.slug}
                href={`/deployment-recipes/${item.slug}`}
                className="group flex flex-col rounded-xl border border-hairline bg-panel p-5 card-glow transition-all hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.25)]"
              >
                {item.image && (
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg border border-hairline">
                    <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-amber font-mono">
                    {item.category}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${difficultyColor}`}>
                    {difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-medium text-foreground transition-colors group-hover:text-amber">
                  {item.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">
                  {item.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border border-hairline px-2 py-0.5 text-xs transition-colors group-hover:border-amber/30 group-hover:text-amber`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-xs font-mono ${textColor}`}>
                    {item.estimated_time || "30 min"}
                  </span>
                  <span className="flex items-center text-sm font-medium text-amber">
                    Open recipe
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <p className="text-foreground-secondary">No recipes match your filters.</p>
          </div>
        )}
      </section>

      {/* Why trust these recipes */}
      <section className="border-t border-hairline bg-panel/50 px-6 py-16">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Why these recipes are different
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Check,
                title: "Tested paths",
                body: "Every recipe follows a real install sequence. We note the versions that worked and the commands that failed.",
              },
              {
                icon: Terminal,
                title: "Copy-paste ready",
                body: "Commands are formatted to run as-is. No hand-waving about 'figure out the paths yourself.'",
              },
              {
                icon: Zap,
                title: "Failure modes included",
                body: "We list the errors you are likely to see and the exact fix, not just the happy path.",
              },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-xl border border-hairline bg-elevated p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-amber/10 text-amber">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm text-foreground-secondary">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
