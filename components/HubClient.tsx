"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AgentProfile, MarketplaceItem } from "@/lib/marketplace/types";
import { getSectionTitle } from "@/lib/marketplace/types";
import {
  Bot,
  Zap,
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
} from "lucide-react";

interface Props {
  agents: AgentProfile[];
  genericItems: Record<string, MarketplaceItem[]>;
}

const sections = [
  { id: "agents", href: "/agents", title: "Agent Directory", description: "Compare autonomous AI agents side-by-side.", icon: Bot },
  { id: "llms", href: "/llms", title: "LLM Pricing", description: "Pricing, context windows, and benchmark scores.", icon: Cpu },
  { id: "services", href: "/services", title: "Services", description: "Hosting, security, data, and observability vendors.", icon: Wrench },
  { id: "skills", href: "/skills", title: "Skills & Addons", description: "Reusable skills, MCP servers, plugins, and extensions.", icon: Puzzle },
  { id: "guides", href: "/guides", title: "How-To Guides", description: "Curated starting points and deep dives.", icon: BookOpen },
  { id: "tips", href: "/tips", title: "Tips & Tricks", description: "Bite-sized advice to level up your agent workflow.", icon: Lightbulb },
  { id: "tests", href: "/tests", title: "Test Results", description: "Real-world benchmark reports from the community.", icon: BarChart3 },
  { id: "self-hosting", href: "/self-hosting", title: "Self-Hosting", description: "Hardware and OS guides for local agents and LLMs.", icon: Home },
  { id: "use-cases", href: "/use-cases", title: "Use Cases", description: "Find agents for code review, UI building, debugging, research, and security.", icon: Target },
  { id: "alternatives", href: "/alternatives", title: "Alternatives", description: "Top replacements for Copilot, Cursor, ChatGPT, Claude, and more.", icon: ArrowLeftRight },
  { id: "deployment-recipes", href: "/deployment-recipes", title: "Deployment Recipes", description: "Copy-paste recipes for Ollama, Open WebUI, Cline, and more.", icon: FlaskConical },
  { id: "deals", href: "/deals", title: "Vendor Deals", description: "Credits, startup programs, and free tiers.", icon: Tag },
  { id: "safety", href: "/safety", title: "AI Safety", description: "Permission models, prompt injection defenses, and trust checklists.", icon: Shield },
  { id: "getting-started", href: "/getting-started", title: "Getting Started", description: "A learning path from your first agent to local self-hosting.", icon: Rocket },
  { id: "lab", href: "/lab", title: "The Lab", description: "Experiments on AI hardware, software, applications, and devices.", icon: Microscope },
  { id: "changelog", href: "/changelog", title: "Agent Changelog", description: "Recent releases and notable updates from major agents.", icon: ScrollText },
];

export default function HubClient({ agents, genericItems }: Props) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

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
      <section className="relative overflow-hidden border-b border-hairline px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-panel px-4 py-1.5 text-xs font-medium text-foreground-secondary">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Independent AI Directory
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Find the right AI agent.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground-secondary md:text-xl">
            Compare autonomous agents, LLM pricing, open-source tools, vendor services, and tested self-hosting recipes.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-tertiary" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agents, services, skills, guides, tips, tests..."
                className="w-full rounded-xl border border-hairline bg-panel pl-11 pr-4 py-3.5 text-foreground placeholder:text-foreground-tertiary outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {query && hasResults && (
            <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-hairline bg-panel p-5 text-left">
              {topAgents.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Agents</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topAgents.map((a) => (
                      <Link key={a.id} href={`/agents/${a.id}`} className="rounded-md border border-hairline bg-elevated px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent">
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
                    {genericResults.map((i) => (
                      <Link key={`${i.section}-${i.slug}`} href={i.href} className="flex items-center justify-between rounded-md border border-hairline bg-elevated px-3 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent">
                        <span className="truncate pr-2">{i.title}</span>
                        <span className="shrink-0 rounded-full bg-hairline px-2 py-0.5 text-xs text-foreground-secondary capitalize font-mono">
                          {getSectionTitle(i.section)}
                        </span>
                      </Link>
                    ))}
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

      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Directory</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Browse by category</h2>
          </div>
          <span className="text-sm text-foreground-tertiary font-mono">{filteredSections.length} sections</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSections.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group relative flex flex-col justify-between rounded-xl border border-hairline bg-panel p-5 transition-all hover:border-hairline-strong hover:bg-elevated"
              >
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-elevated text-foreground-secondary transition-colors group-hover:border-accent group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-accent">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">{s.description}</p>
                </div>
                <div className="mt-5 flex items-center text-sm font-medium text-accent">
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
