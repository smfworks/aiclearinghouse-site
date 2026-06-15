"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import {
  Newspaper,
  ExternalLink,
  Clock,
  Zap,
  Bot,
  Cpu,
  Scale,
  Code2,
  Rocket,
  Globe,
  ArrowRight,
} from "lucide-react";

interface Props {
  items: MarketplaceItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  Models: <Cpu className="h-4 w-4" />,
  Agents: <Bot className="h-4 w-4" />,
  "Product Launches": <Rocket className="h-4 w-4" />,
  APIs: <Code2 className="h-4 w-4" />,
  "Open Source": <Code2 className="h-4 w-4" />,
  Regulation: <Scale className="h-4 w-4" />,
  Security: <ShieldNews className="h-4 w-4" />,
  Deals: <Zap className="h-4 w-4" />,
  Hardware: <Globe className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  Models: "text-cyan border-cyan/30 bg-cyan/5",
  Agents: "text-violet border-violet/30 bg-violet/5",
  "Product Launches": "text-emerald border-emerald/30 bg-emerald/5",
  APIs: "text-amber border-amber/30 bg-amber/5",
  "Open Source": "text-rose border-rose/30 bg-rose/5",
  Regulation: "text-accent border-accent/30 bg-accent/5",
  Security: "text-rose border-rose/30 bg-rose/5",
  Deals: "text-emerald border-emerald/30 bg-emerald/5",
  Hardware: "text-cyan border-cyan/30 bg-cyan/5",
};

function ShieldNews({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 5) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AINewsClient({ items }: Props) {
  const grouped = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => new Date(String(b.published_at)).getTime() - new Date(String(a.published_at)).getTime()
    );
    const map = new Map<string, MarketplaceItem[]>();
    for (const item of sorted) {
      const cat = item.category || "News";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [items]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-hairline bg-elevated px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-foreground-secondary transition-colors hover:text-foreground">
            ← Home
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">AI News</h1>
          </div>
          <p className="mt-2 max-w-2xl text-foreground-secondary">
            Curated AI headlines updated throughout the day. No summaries, no clickbait — just the links that matter.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-foreground-tertiary font-mono"
          >
            <Clock className="h-3.5 w-3.5" />
            {items.length} stories · updated {grouped[0]?.[1][0]?.published_at ? formatTimeAgo(String(grouped[0][1][0].published_at)) : "recently"}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main headline feed */}
          <div className="lg:col-span-2 space-y-8">
            {grouped.map(([category, stories]) => {
              const colorClass = categoryColors[category] || categoryColors["Models"];
              const icon = categoryIcons[category] || <Globe className="h-4 w-4" />;
              return (
                <div key={category}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
                      {icon}
                      {category}
                    </span>
                    <span className="text-xs text-foreground-tertiary font-mono">{stories.length} stories</span>
                  </div>
                  <div className="rounded-xl border border-hairline bg-panel overflow-hidden">
                    {stories.map((story, idx) => (
                      <a
                        key={story.slug}
                        href={String(story.url || "").replace(/^\//, "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-elevated/50 ${
                          idx !== stories.length - 1 ? "border-b border-hairline" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <h2 className="text-base font-medium leading-snug text-foreground transition-colors group-hover:text-accent"
                          >
                            {story.title}
                          </h2>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-foreground-tertiary"
                          >
                            <span className="font-mono">{story.source}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1"
                            >
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(String(story.published_at))}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-foreground-tertiary transition-colors group-hover:text-accent" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-hairline bg-panel p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="h-4 w-4 text-accent" />
                Latest across all categories
              </h3>
              <div className="mt-4 space-y-3">
                {items
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(String(b.published_at)).getTime() - new Date(String(a.published_at)).getTime()
                  )
                  .slice(0, 5)
                  .map((story) => (
                    <a
                      key={story.slug}
                      href={String(story.url || "").replace(/^\//, "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block text-sm"
                    >
                      <p className="font-medium text-foreground transition-colors group-hover:text-accent"
                      >
                        {story.title}
                      </p>
                      <p className="mt-0.5 text-xs text-foreground-tertiary"
                      >
                        {story.source} · {formatTimeAgo(String(story.published_at))}
                      </p>
                    </a>
                  ))}
              </div>
            </div>

            <div className="rounded-xl border border-hairline bg-panel p-5"
            >
              <h3 className="text-sm font-semibold text-foreground"
              >About this feed</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-secondary"
              >
                Headlines are curated by an autonomous agent and reviewed before publishing. Each link goes to the original source. We do not rewrite or summarize the stories.
              </p>
              <Link
                href="/agents"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Browse agent directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
