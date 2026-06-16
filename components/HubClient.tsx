"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { AgentProfile, MarketplaceItem } from "@/lib/marketplace/types";
import { getSectionTitle } from "@/lib/marketplace/types";
import {
  Bot,
  Wrench,
  Puzzle,
  BookOpen,
  Lightbulb,
  BarChart3,
  Home,
  Target,
  ArrowLeftRight,
  FlaskConical,
  Tag,
  Shield,
  Rocket,
  Microscope,
  ScrollText,
  Cpu,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Flame,
  Radio,
  Newspaper,
} from "lucide-react";

interface Props {
  agents: AgentProfile[];
  genericItems: Record<string, MarketplaceItem[]>;
}

type SectionColor = {
  text: string;
  glow: string;
  muted: string;
};

const sectionColors: Record<string, SectionColor> = {
  "getting-started": { text: "#f5a623", glow: "rgba(245, 166, 35, 0.28)", muted: "rgba(245, 166, 35, 0.10)" },
  agents: { text: "#22d3ee", glow: "rgba(34, 211, 238, 0.28)", muted: "rgba(34, 211, 238, 0.10)" },
  llms: { text: "#a78bfa", glow: "rgba(167, 139, 250, 0.28)", muted: "rgba(167, 139, 250, 0.10)" },
  services: { text: "#60a5fa", glow: "rgba(96, 165, 250, 0.28)", muted: "rgba(96, 165, 250, 0.10)" },
  skills: { text: "#34d399", glow: "rgba(52, 211, 153, 0.28)", muted: "rgba(52, 211, 153, 0.10)" },
  guides: { text: "#fbbf24", glow: "rgba(251, 191, 36, 0.28)", muted: "rgba(251, 191, 36, 0.10)" },
  tips: { text: "#a3e635", glow: "rgba(163, 230, 53, 0.28)", muted: "rgba(163, 230, 53, 0.10)" },
  tests: { text: "#fb7185", glow: "rgba(251, 113, 133, 0.28)", muted: "rgba(251, 113, 133, 0.10)" },
  "self-hosting": { text: "#4ade80", glow: "rgba(74, 222, 128, 0.28)", muted: "rgba(74, 222, 128, 0.10)" },
  "use-cases": { text: "#fb923c", glow: "rgba(251, 146, 60, 0.28)", muted: "rgba(251, 146, 60, 0.10)" },
  alternatives: { text: "#f472b6", glow: "rgba(244, 114, 182, 0.28)", muted: "rgba(244, 114, 182, 0.10)" },
  "deployment-recipes": { text: "#f59e0b", glow: "rgba(245, 158, 11, 0.28)", muted: "rgba(245, 158, 11, 0.10)" },
  deals: { text: "#facc15", glow: "rgba(250, 204, 21, 0.28)", muted: "rgba(250, 204, 21, 0.10)" },
  safety: { text: "#ef4444", glow: "rgba(239, 68, 68, 0.28)", muted: "rgba(239, 68, 68, 0.10)" },
  lab: { text: "#818cf8", glow: "rgba(129, 140, 248, 0.28)", muted: "rgba(129, 140, 248, 0.10)" },
  changelog: { text: "#2dd4bf", glow: "rgba(45, 212, 191, 0.28)", muted: "rgba(45, 212, 191, 0.10)" },
  "ai-news": { text: "#f5a623", glow: "rgba(245, 166, 35, 0.28)", muted: "rgba(245, 166, 35, 0.10)" },
};

const sections = [
  { id: "getting-started", href: "/getting-started", title: "Getting Started", description: "A learning path from your first agent to local self-hosting.", icon: Rocket, featured: true },
  { id: "agents", href: "/agents", title: "Agent Directory", description: "Compare autonomous AI agents side-by-side.", icon: Bot, featured: true },
  { id: "llms", href: "/llms", title: "LLM Pricing", description: "Pricing, context windows, and benchmark scores.", icon: Cpu, featured: true },
  { id: "services", href: "/services", title: "Services", description: "Hosting, security, data, and observability vendors.", icon: Wrench },
  { id: "skills", href: "/skills", title: "Skills \u0026 Addons", description: "Reusable skills, MCP servers, plugins, and extensions.", icon: Puzzle },
  { id: "guides", href: "/guides", title: "How-To Guides", description: "Curated starting points and deep dives.", icon: BookOpen },
  { id: "tips", href: "/tips", title: "Tips \u0026 Tricks", description: "Bite-sized advice to level up your agent workflow.", icon: Lightbulb },
  { id: "tests", href: "/tests", title: "Test Results", description: "Real-world benchmark reports from the community.", icon: BarChart3 },
  { id: "self-hosting", href: "/self-hosting", title: "Self-Hosting", description: "Hardware and OS guides for local agents and LLMs.", icon: Home },
  { id: "use-cases", href: "/use-cases", title: "Use Cases", description: "Find agents for code review, UI building, debugging, research, and security.", icon: Target },
  { id: "alternatives", href: "/alternatives", title: "Alternatives", description: "Top replacements for Copilot, Cursor, ChatGPT, Claude, and more.", icon: ArrowLeftRight },
  { id: "deployment-recipes", href: "/deployment-recipes", title: "Deployment Recipes", description: "Copy-paste recipes for Ollama, Open WebUI, Cline, and more.", icon: FlaskConical, featured: true },
  { id: "deals", href: "/deals", title: "Vendor Deals", description: "Credits, startup programs, and free tiers.", icon: Tag },
  { id: "safety", href: "/safety", title: "AI Safety", description: "Permission models, prompt injection defenses, and trust checklists.", icon: Shield },
  { id: "lab", href: "/lab", title: "The Lab", description: "Experiments on AI hardware, software, applications, and devices.", icon: Microscope },
  { id: "changelog", href: "/changelog", title: "Agent Changelog", description: "Recent releases and notable updates from major agents.", icon: ScrollText },
  { id: "ai-news", href: "/ai-news", title: "AI News", description: "Curated AI headlines updated throughout the day.", icon: Newspaper, featured: true },
];

function colorFor(sectionId: string): SectionColor {
  return sectionColors[sectionId] || sectionColors["getting-started"];
}

export default function HubClient({ agents, genericItems }: Props) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const totalItems = useMemo(() => {
    return agents.length + Object.values(genericItems).reduce((sum, arr) => sum + arr.length, 0);
  }, [agents, genericItems]);

  const topAgents = useMemo(() => {
    if (!q) return [];
    return agents
      .filter((a) =>
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.categories.some((c) => c.toLowerCase().includes(q)) ||
        a.tagline.toLowerCase().includes(q)
      )
      .slice(0, 4);
  }, [agents, q]);

  const genericResults = useMemo(() => {
    if (!q) return [];
    const all = Object.entries(genericItems).flatMap(([section, items]) =>
      items.map((i) => ({ ...i, section, href: `/${section}/${i.slug}` }))
    );
    return all
      .filter((i) =>
        i.title.toLowerCase().includes(q) ||
        i.excerpt.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [genericItems, q]);

  const hasResults = topAgents.length > 0 || genericResults.length > 0;

  const filteredSections = useMemo(() => {
    if (!q) return sections;
    return sections.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [q]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline px-6 pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/clearinghouse-hero.png"
            alt="Abstract network of connected AI nodes"
            fill
            className="object-cover object-center opacity-90"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas/25 via-canvas/50 to-canvas/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas/20 via-transparent to-canvas/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--canvas)_90%)]" />
        </div>
        <div className="bg-grid-faint absolute inset-0 pointer-events-none z-10 opacity-50" />
        <div className="relative z-20 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-panel/80 px-4 py-1.5 text-xs font-medium text-foreground-secondary shadow-[0_0_20px_-8px_var(--accent-glow)]">
            <Radio className="h-3.5 w-3.5 text-cyan cyan-pulse rounded-full" />
            Independent AI Directory
          </div>

          <h1 className="mt-7 text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            The tools are multiplying.
            <br />
            <span className="text-gradient">The clarity isn&apos;t.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground-secondary md:text-xl">
            Compare autonomous agents, LLM pricing, open-source tools, vendor services, and tested self-hosting recipes — without wading through marketing copy.
          </p>

          {/* Search */}
          <div className="mx-auto mt-9 max-w-xl">
            <div className="group relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agents, services, skills, recipes, guides..."
                className="w-full rounded-xl border border-hairline bg-panel/90 pl-11 pr-4 py-3.5 text-foreground placeholder:text-foreground-tertiary outline-none transition-all focus:border-accent focus:bg-elevated focus:ring-1 focus:ring-accent/50"
              />
            </div>
          </div>

          {/* Live stats */}
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-foreground-tertiary font-mono uppercase tracking-wider">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-accent" />
              {agents.length} agents tracked
            </span>
            <span className="hidden h-3 w-px bg-hairline-strong sm:inline" />
            <span>{totalItems} entries</span>
            <span className="hidden h-3 w-px bg-hairline-strong sm:inline" />
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-cyan" />
              Updated daily
            </span>
          </div>

          {/* Search results overlay */}
          {query && hasResults && (
            <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-hairline bg-panel p-5 text-left shadow-[0_0_40px_-12px_rgba(0,0,0,0.5)]">
              {topAgents.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Agents</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topAgents.map((a) => (
                      <Link key={a.id} href={`/agents/${a.id}`} className="rounded-md border border-hairline bg-elevated px-3 py-1.5 text-sm text-foreground transition-all hover:border-cyan hover:text-cyan hover:shadow-[0_0_16px_-6px_var(--cyan-glow)]">
                        {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {genericResults.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Sections</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {genericResults.map((i) => {
                      const c = colorFor(i.section);
                      return (
                        <Link
                          key={`${i.section}-${i.slug}`}
                          href={i.href}
                          className="flex items-center justify-between rounded-md border border-hairline bg-elevated px-3 py-2 text-sm text-foreground transition-all hover:shadow-[0_0_16px_-6px_var(--cyan-glow)]"
                          style={{ color: "var(--foreground)", borderColor: "var(--hairline)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = c.text;
                            e.currentTarget.style.color = c.text;
                            e.currentTarget.style.boxShadow = `0 0 16px -6px ${c.glow}`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--hairline)";
                            e.currentTarget.style.color = "var(--foreground)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <span className="truncate pr-2">{i.title}</span>
                          <span className="shrink-0 rounded-full bg-hairline px-2 py-0.5 text-xs text-foreground-secondary capitalize font-mono">
                            {getSectionTitle(i.section)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {query && !hasResults && (
            <p className="mt-6 text-sm text-foreground-secondary">
              No results for &quot;{query}&quot;. Try a broader term or browse the sections below.
            </p>
          )}
        </div>
      </section>

      {/* Featured spotlight */}
      <section className="mx-auto w-full max-w-7xl px-6 -mt-6 relative z-10">
        <Link href="/getting-started" className="group flex flex-col sm:flex-row items-center gap-5 rounded-xl border border-accent/30 bg-gradient-to-r from-panel via-elevated to-panel p-5 shadow-[0_0_40px_-16px_var(--accent-glow)] transition-all hover:border-accent/60 hover:shadow-[0_0_50px_-14px_var(--accent-glow)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
            <Flame className="h-6 w-6" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">Start here</p>
            <h3 className="mt-0.5 text-lg font-medium text-foreground">New to AI agents? Follow the getting-started path.</h3>
            <p className="text-sm text-foreground-secondary">Six steps from your first prompt to a working local setup — no hype, no vendor lock-in.</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent">
            Begin the path
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      {/* Directory grid */}
      <section className="relative mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 card-rainbow-ambient opacity-30" />

        <div className="relative mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Directory</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Find your way in</h2>
          </div>
          <span className="text-sm text-foreground-tertiary font-mono">{filteredSections.length} sections</span>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSections.map((s) => {
            const Icon = s.icon;
            const color = colorFor(s.id);
            const featured = s.featured;

            return (
              <Link
                key={s.href}
                href={s.href}
                className={`group relative flex flex-col justify-between rounded-xl border border-hairline bg-panel p-5 transition-all duration-200 card-glow hover:bg-elevated ${featured ? "sm:col-span-2 lg:col-span-1" : ""}`}
                style={{ color: color.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color.text;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${color.text}, 0 0 40px -12px ${color.glow}, 0 12px 32px -12px rgba(0,0,0,0.6)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--hairline)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px var(--hairline), 0 4px 24px -10px rgba(0, 0, 0, 0.5)";
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-60"
                  style={{ background: `linear-gradient(to right, transparent, ${color.text}, transparent)` }}
                />

                {featured && (
                  <div
                    className="absolute -inset-px rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${color.glow} 0%, transparent 60%)` }}
                  />
                )}

                <div className="relative">
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-elevated text-foreground-secondary transition-all group-hover:border-opacity-50 group-hover:text-white"
                    style={{
                      borderColor: "var(--hairline)",
                      background: color.muted,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color.text;
                      e.currentTarget.style.boxShadow = `0 0 20px -6px ${color.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--hairline)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: color.text }} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-white">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">{s.description}</p>
                </div>
                <div className="relative mt-5 flex items-center text-sm font-medium" style={{ color: color.text }}>
                  Explore <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
