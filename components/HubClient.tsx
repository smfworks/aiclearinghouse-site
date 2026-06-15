"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AgentProfile, MarketplaceItem } from "@/lib/marketplace/types";
import { getSectionTitle } from "@/lib/marketplace/types";

interface Props {
  agents: AgentProfile[];
  genericItems: Record<string, MarketplaceItem[]>;
}

const sections = [
  { id: "agents", href: "/agents", title: "Agent Directory", description: "Compare autonomous AI agents side-by-side.", icon: "🤖", color: "from-primary/20 to-primary/5" },
  { id: "llms", href: "/llms", title: "LLM Pricing", description: "Pricing, context windows, and benchmark scores.", icon: "⚡", color: "from-amber-500/20 to-amber-500/5" },
  { id: "services", href: "/services", title: "Services", description: "Hosting, security, data, and observability vendors.", icon: "🛠️", color: "from-yellow-500/20 to-yellow-500/5" },
  { id: "skills", href: "/skills", title: "Skills & Addons", description: "Reusable skills, MCP servers, plugins, and extensions.", icon: "🧩", color: "from-purple-500/20 to-purple-500/5" },
  { id: "guides", href: "/guides", title: "How-To Guides", description: "Curated starting points and deep dives.", icon: "📚", color: "from-cyan-500/20 to-cyan-500/5" },
  { id: "tips", href: "/tips", title: "Tips & Tricks", description: "Bite-sized advice to level up your agent workflow.", icon: "💡", color: "from-orange-500/20 to-orange-500/5" },
  { id: "tests", href: "/tests", title: "Test Results", description: "Real-world benchmark reports from the community.", icon: "📊", color: "from-emerald-500/20 to-emerald-500/5" },
  { id: "self-hosting", href: "/self-hosting", title: "Self-Hosting", description: "Hardware and OS guides for local agents and LLMs.", icon: "🏠", color: "from-green-500/20 to-green-500/5" },
  { id: "use-cases", href: "/use-cases", title: "Use Cases", description: "Find agents for code review, UI building, debugging, research, and security.", icon: "🎯", color: "from-violet-500/20 to-violet-500/5" },
  { id: "alternatives", href: "/alternatives", title: "Alternatives", description: "Top replacements for Copilot, Cursor, ChatGPT, Claude, and more.", icon: "🔀", color: "from-amber-400/20 to-amber-400/5" },
  { id: "deployment-recipes", href: "/deployment-recipes", title: "Deployment Recipes", description: "Copy-paste recipes for Ollama, Open WebUI, Cline, and more.", icon: "🧪", color: "from-pink-500/20 to-pink-500/5" },
  { id: "deals", href: "/deals", title: "Vendor Deals", description: "Credits, startup programs, and free tiers.", icon: "🏷️", color: "from-teal-500/20 to-teal-500/5" },
  { id: "safety", href: "/safety", title: "AI Safety", description: "Permission models, prompt injection defenses, and trust checklists.", icon: "🛡️", color: "from-red-500/20 to-red-500/5" },
  { id: "getting-started", href: "/getting-started", title: "Getting Started", description: "A learning path from your first agent to local self-hosting.", icon: "🚀", color: "from-blue-500/20 to-blue-500/5" },
  { id: "lab", href: "/lab", title: "The Lab", description: "Experiments on AI hardware, software, applications, and devices.", icon: "🔬", color: "from-fuchsia-500/20 to-fuchsia-500/5" },
  { id: "changelog", href: "/changelog", title: "Agent Changelog", description: "Recent releases and notable updates from major agents.", icon: "📝", color: "from-slate-500/20 to-slate-500/5" },
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
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden border-b border-border px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Independent AI Directory
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            SMF Clearinghouse
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Your starting point for autonomous AI agents, LLMs, services, skills, and practical know-how.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents, services, skills, guides, tips, tests..."
              className="w-full rounded-xl border border-border bg-background px-5 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
          </div>

          {query && hasResults && (
            <div className="mt-8 rounded-xl border border-border bg-card p-5 text-left shadow-sm">
              {topAgents.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agents</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topAgents.map((a) => (
                      <Link key={a.id} href={`/agents/${a.id}`} className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground hover:border-primary hover:text-primary">
                        {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {genericResults.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {genericResults.map((i) => (
                      <Link key={`${i.section}-${i.slug}`} href={i.href} className="flex items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground hover:border-primary hover:text-primary">
                        <span className="truncate pr-2">{i.title}</span>
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">{getSectionTitle(i.section)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {query && !hasResults && (
            <p className="mt-6 text-sm text-muted-foreground">No results for &quot;{query}&quot;. Try a broader term or browse the sections below.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSections.map((s) => (
            <Link key={s.href} href={s.href} className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${s.color} p-6 transition-all hover:border-primary hover:shadow-sm`}>
              <div className="mb-4 text-4xl">{s.icon}</div>
              <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <div className="mt-4 text-sm font-semibold text-primary">Explore →</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
