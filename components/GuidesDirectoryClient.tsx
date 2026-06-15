"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { Search, ArrowRight, Clock, BookOpen, Compass, Shield, Cpu } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  items: MarketplaceItem[];
}

const paths: { id: string; label: string; icon: React.ReactNode; description: string; filter: (item: MarketplaceItem) => boolean }[] = [
  {
    id: "start",
    label: "Start here",
    icon: <Compass className="h-5 w-5" />,
    description: "If you are new to agents, start with these two",
    filter: (item) => item.slug === "choosing-your-first-agent" || item.slug === "evaluating-an-agent-for-your-stack",
  },
  {
    id: "build",
    label: "Build and deploy",
    icon: <Cpu className="h-5 w-5" />,
    description: "Get models running and agents connected",
    filter: (item) => item.slug === "local-llms-vs-api" || item.slug === "running-local-models-for-agents" || item.slug === "setting-up-hermes-gateway",
  },
  {
    id: "secure",
    label: "Secure and scale",
    icon: <Shield className="h-5 w-5" />,
    description: "Lock down permissions before production",
    filter: (item) => item.slug === "securing-agent-tool-permissions",
  },
];

export default function GuidesDirectoryClient({ items }: Props) {
  const [search, setSearch] = useState("");
  const [activePath, setActivePath] = useState<string>("all");

  const allSorted = useMemo(() => {
    return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    let base = allSorted;
    if (activePath !== "all") {
      const path = paths.find((p) => p.id === activePath);
      if (path) base = base.filter(path.filter);
    }
    return base.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [allSorted, search, activePath]);

  const featured = allSorted.find((item) => item.slug === "choosing-your-first-agent") || allSorted[0];

  function getGuideNumber(item: MarketplaceItem): number {
    const idx = allSorted.findIndex((i) => i.slug === item.slug);
    return idx + 1;
  }

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
            <BookOpen className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">How-To Guides</h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-foreground-secondary">
            Curated starting points and deep dives for AI builders. Decision trees, evaluation frameworks,
            deployment playbooks, and security hardening.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {/* Featured guide */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-hairline bg-panel card-glow">
          <div className="grid md:grid-cols-5">
            <div className="border-b border-hairline bg-elevated p-8 md:col-span-2 md:border-b-0 md:border-r">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent">
                <Compass className="h-3.5 w-3.5" />
                Start here
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Not sure where to begin?</h2>
              <p className="mt-2 text-foreground-secondary">
                Our most-read guide walks first-time buyers through 4 questions that narrow the market to the
                right agent.
              </p>
            </div>
            <div className="p-8 md:col-span-3">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl font-semibold text-accent">
                  01
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground">{featured.title}</h3>
                  <p className="mt-2 text-foreground-secondary">{featured.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-foreground-tertiary">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {featured.readingTime || 5} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {featured.wordCount?.toLocaleString() || 0} words
                    </span>
                  </div>
                  <Link
                    href={`/guides/${featured.slug}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
                  >
                    Read the decision tree
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Path filters */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => setActivePath("all")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              activePath === "all"
                ? "border-accent bg-accent/10"
                : "border-hairline bg-panel hover:border-hairline-strong"
            }`}
          >
            <BookOpen className={`h-5 w-5 ${activePath === "all" ? "text-accent" : "text-foreground-tertiary"}`} />
            <div>
              <span className="block text-sm font-medium text-foreground">All guides</span>
              <span className="text-xs text-foreground-secondary">{items.length} total</span>
            </div>
          </button>
          {paths.map((path) => (
            <button
              key={path.id}
              onClick={() => setActivePath(path.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                activePath === path.id
                  ? "border-accent bg-accent/10"
                  : "border-hairline bg-panel hover:border-hairline-strong"
              }`}
            >
              <span className={activePath === path.id ? "text-accent" : "text-foreground-tertiary"}>{path.icon}</span>
              <div>
                <span className="block text-sm font-medium text-foreground">{path.label}</span>
                <span className="text-xs text-foreground-secondary">{path.description}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8 rounded-xl border border-hairline bg-panel p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides by title, topic, or keyword..."
              className="w-full rounded-lg border border-hairline bg-canvas pl-10 pr-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>

        <p className="mb-6 text-sm text-foreground-secondary font-mono">
          Showing {filteredItems.length} of {items.length} guides
        </p>

        {/* Guide list */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Link
              key={item.slug}
              href={`/guides/${item.slug}`}
              className="group flex flex-col rounded-xl border border-hairline bg-panel p-6 transition-all hover:border-hairline-strong hover:bg-elevated sm:flex-row sm:items-start sm:gap-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-elevated text-xl font-semibold text-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                {String(getGuideNumber(item)).padStart(2, "0")}
              </div>
              <div className="mt-4 flex-1 sm:mt-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-accent font-mono">{item.category}</span>
                  {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
                </div>
                <h2 className="mt-2 text-xl font-medium text-foreground transition-colors group-hover:text-accent">
                  {item.title}
                </h2>
                <p className="mt-2 max-w-3xl text-foreground-secondary">{item.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground-tertiary">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {item.readingTime || 5} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {item.wordCount?.toLocaleString() || 0} words
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-hairline px-2.5 py-0.5 text-xs text-foreground-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex shrink-0 items-center self-end text-sm font-medium text-accent sm:mt-0 sm:self-center">
                Read
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="rounded-xl border border-hairline bg-panel p-12 text-center">
            <p className="text-foreground-secondary">No guides match your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
