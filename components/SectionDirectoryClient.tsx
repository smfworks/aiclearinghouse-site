"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { getSectionTitle } from "@/lib/marketplace/types";
import XVideoEmbed from "@/components/XVideoEmbed";
import { ArrowRight, Search, Layers, Server, Database, Shield, Zap, Bot, Wrench, Beaker, FileText, Terminal, Lightbulb } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Hardware: <Server className="h-3 w-3" />,
  OS: <Terminal className="h-3 w-3" />,
  "GPU Setup": <Zap className="h-3 w-3" />,
  Development: <Terminal className="h-3 w-3" />,
  Operations: <Wrench className="h-3 w-3" />,
  Research: <FileText className="h-3 w-3" />,
  Design: <Beaker className="h-3 w-3" />,
  Security: <Shield className="h-3 w-3" />,
  "AI Chat": <Bot className="h-3 w-3" />,
  "AI Coding": <Terminal className="h-3 w-3" />,
  Editor: <Wrench className="h-3 w-3" />,
  Assistant: <Bot className="h-3 w-3" />,
  Infrastructure: <Server className="h-3 w-3" />,
  Database: <Database className="h-3 w-3" />,
  Tool: <Wrench className="h-3 w-3" />,
  Checklist: <FileText className="h-3 w-3" />,
  Threat: <Shield className="h-3 w-3" />,
  "Prompt Injection": <Shield className="h-3 w-3" />,
  Experiment: <Beaker className="h-3 w-3" />,
  Project: <Terminal className="h-3 w-3" />,
  Agent: <Bot className="h-3 w-3" />,
  Model: <Zap className="h-3 w-3" />,
  Platform: <Server className="h-3 w-3" />,
  Guide: <FileText className="h-3 w-3" />,
  Tip: <Lightbulb className="h-3 w-3" />,
  Recipe: <Wrench className="h-3 w-3" />,
  Service: <Server className="h-3 w-3" />,
};
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  items: MarketplaceItem[];
  section: string;
  title: string;
  description: string;
  videoTweetUrl?: string;
}

const categoryColors: Record<string, string> = {
  // Self-hosting
  Hardware: "text-cyan border-cyan/30 bg-cyan/5",
  OS: "text-emerald border-emerald/30 bg-emerald/5",
  "GPU Setup": "text-amber-400 border-amber-400/30 bg-amber-400/5",
  // Use cases
  Development: "text-cyan border-cyan/30 bg-cyan/5",
  Operations: "text-amber border-amber/30 bg-amber/5",
  Research: "text-emerald border-emerald/30 bg-emerald/5",
  Design: "text-rose border-rose/30 bg-rose/5",
  Security: "text-rose border-rose/30 bg-rose/5",
  // Alternatives
  "AI Chat": "text-cyan border-cyan/30 bg-cyan/5",
  "AI Coding": "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Editor: "text-amber border-amber/30 bg-amber/5",
  Assistant: "text-emerald border-emerald/30 bg-emerald/5",
  // Deals
  Infrastructure: "text-cyan border-cyan/30 bg-cyan/5",
  Database: "text-emerald border-emerald/30 bg-emerald/5",
  Tool: "text-amber border-amber/30 bg-amber/5",
  // Safety
  Checklist: "text-emerald border-emerald/30 bg-emerald/5",
  Threat: "text-rose border-rose/30 bg-rose/5",
  "Prompt Injection": "text-rose border-rose/30 bg-rose/5",
  // Lab
  Experiment: "text-accent border-accent/30 bg-accent/5",
  Project: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  // Changelog
  Agent: "text-cyan border-cyan/30 bg-cyan/5",
  Model: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Platform: "text-amber border-amber/30 bg-amber/5",
  // Fallbacks
  Guide: "text-accent border-accent/30 bg-accent/5",
  Tip: "text-accent border-accent/30 bg-accent/5",
  Recipe: "text-amber border-amber/30 bg-amber/5",
  Service: "text-cyan border-cyan/30 bg-cyan/5",
};

const categoryTextColors: Record<string, string> = {
  Hardware: "text-cyan",
  OS: "text-emerald",
  "GPU Setup": "text-amber-400",
  Development: "text-cyan",
  Operations: "text-amber",
  Research: "text-emerald",
  Design: "text-rose",
  Security: "text-rose",
  "AI Chat": "text-cyan",
  "AI Coding": "text-amber-400",
  Editor: "text-amber",
  Assistant: "text-emerald",
  Infrastructure: "text-cyan",
  Database: "text-emerald",
  Tool: "text-amber",
  Checklist: "text-emerald",
  Threat: "text-rose",
  "Prompt Injection": "text-rose",
  Experiment: "text-accent",
  Project: "text-amber-400",
  Agent: "text-cyan",
  Model: "text-amber-400",
  Platform: "text-amber",
  Guide: "text-accent",
  Tip: "text-accent",
  Recipe: "text-amber",
  Service: "text-cyan",
};

const categoryBorderColors: Record<string, string> = {
  Hardware: "border-l-cyan",
  OS: "border-l-emerald",
  "GPU Setup": "border-l-amber-400",
  Development: "border-l-cyan",
  Operations: "border-l-amber",
  Research: "border-l-emerald",
  Design: "border-l-rose",
  Security: "border-l-rose",
  "AI Chat": "border-l-cyan",
  "AI Coding": "border-l-amber-400",
  Editor: "border-l-amber",
  Assistant: "border-l-emerald",
  Infrastructure: "border-l-cyan",
  Database: "border-l-emerald",
  Tool: "border-l-amber",
  Checklist: "border-l-emerald",
  Threat: "border-l-rose",
  "Prompt Injection": "border-l-rose",
  Experiment: "border-l-accent",
  Project: "border-l-amber-400",
  Agent: "border-l-cyan",
  Model: "border-l-amber-400",
  Platform: "border-l-amber",
  Guide: "border-l-accent",
  Tip: "border-l-accent",
  Recipe: "border-l-amber",
  Service: "border-l-cyan",
};

// Vendor-specific colors for self-hosting hardware pages
const vendorColors: Record<string, { text: string; border: string; glow: string; gradient: string }> = {
  nvidia: {
    text: "text-[#76B900]",
    border: "border-l-[#76B900]",
    glow: "rgba(118,185,0,0.35)",
    gradient: "from-[#76B900]/25 via-[#76B900]/10 to-transparent",
  },
  amd: {
    text: "text-[#B87333]",
    border: "border-l-[#B87333]",
    glow: "rgba(184,115,51,0.35)",
    gradient: "from-[#B87333]/25 via-[#B87333]/10 to-transparent",
  },
  linux: {
    text: "text-[#E91E8C]",
    border: "border-l-[#E91E8C]",
    glow: "rgba(233,30,140,0.35)",
    gradient: "from-[#E91E8C]/25 via-[#E91E8C]/10 to-transparent",
  },
  microsoft: {
    text: "text-[#0078D4]",
    border: "border-l-[#0078D4]",
    glow: "rgba(0,120,212,0.35)",
    gradient: "from-[#0078D4]/25 via-[#0078D4]/10 to-transparent",
  },
};

function getVendorStyle(section: string, item: MarketplaceItem) {
  if (section !== "self-hosting") return null;
  const text = (item.title + " " + item.slug + " " + item.tags.join(" ")).toLowerCase();
  if (text.includes("nvidia") || text.includes("rtx") || text.includes("dgx") || text.includes("cuda")) {
    return vendorColors.nvidia;
  }
  if (text.includes("amd") || text.includes("radeon") || text.includes("instinct") || text.includes("rocm")) {
    return vendorColors.amd;
  }
  if (text.includes("linux") || text.includes("ubuntu") || text.includes("debian") || text.includes("fedora")) {
    return vendorColors.linux;
  }
  if (text.includes("microsoft") || text.includes("windows") || text.includes("azure")) {
    return vendorColors.microsoft;
  }
  return null;
}

const sectionAccentColors: Record<string, string> = {
  "self-hosting": "cyan",
  "use-cases": "emerald",
  alternatives: "amber",
  deals: "amber",
  safety: "rose",
  lab: "accent",
  changelog: "cyan",
  tips: "accent",
  services: "cyan",
  guides: "accent",
  "deployment-recipes": "amber",
  tests: "cyan",
};

function getColorClass(category: string) {
  return categoryColors[category] || "text-accent border-accent/30 bg-accent/5";
}

function getTextColor(category: string) {
  return categoryTextColors[category] || "text-accent";
}

function getBorderColor(category: string) {
  return categoryBorderColors[category] || "border-l-accent";
}

export default function SectionDirectoryClient({ items, section, title, description, videoTweetUrl }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = Array.from(new Set(items.map((i) => i.category))).sort();
  const accentColor = sectionAccentColors[section] || "accent";

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

          {videoTweetUrl && (
            <div className="mt-8 max-w-xl rounded-xl border border-hairline bg-panel p-3 shadow-[0_0_40px_-16px_rgba(0,0,0,0.5)]">
              <XVideoEmbed tweetUrl={videoTweetUrl} className="min-h-[280px]" maxWidth={560} />
            </div>
          )}
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const vendorStyle = getVendorStyle(section, item);
            const colorClass = vendorStyle ? `${vendorStyle.text} border-current bg-current/5` : getColorClass(item.category);
            const textColor = vendorStyle ? vendorStyle.text : getTextColor(item.category);
            const leftBorder = vendorStyle ? vendorStyle.border : getBorderColor(item.category);
            const glowColor = vendorStyle ? vendorStyle.glow : undefined;
            const gradientClass = vendorStyle ? vendorStyle.gradient : undefined;

            return (
              <Link
                key={item.slug}
                href={`/${section}/${item.slug}`}
                className={`group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-panel p-5 transition-all hover:-translate-y-0.5 hover:bg-elevated/50 border-l-4 ${leftBorder}`}
                style={{ boxShadow: "0 0 0 0 transparent" }}
                onMouseEnter={(e) => {
                  if (glowColor) {
                    e.currentTarget.style.boxShadow = `0 0 40px -12px ${glowColor}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
                }}
              >
                {gradientClass && (
                  <div
                    className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${gradientClass} opacity-80 pointer-events-none`}
                  />
                )}
                {item.image && (
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg border border-hairline">
                    <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                  </div>
                )}
                <span className={`relative inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}>
                  {categoryIcons[item.category] || <Layers className="h-3 w-3" />}
                  {item.category}
                </span>
                <h2 className={`relative mt-3 text-lg font-semibold text-foreground transition-colors group-hover:${textColor}`}>
                  {item.title}
                </h2>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">{item.excerpt}</p>
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border border-hairline px-2 py-0.5 text-xs text-foreground-tertiary transition-colors group-hover:${textColor} group-hover:border-current/30`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {item.last_verified && (
                  <div className="relative mt-3">
                    <FreshnessBadge dateString={item.last_verified} />
                  </div>
                )}
                <div className={`relative mt-4 flex items-center text-sm font-medium transition-colors ${textColor}`}>
                  Read <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
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
