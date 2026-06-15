import Link from "next/link";
import type { AgentProfile } from "@/lib/marketplace/types";
import { ExternalLink, GitBranch, Check, ArrowRight, Target, Sparkles, AlertTriangle, Users, Layers, Zap, Cpu, Globe, Calendar, DollarSign } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";
import { getAgentColor } from "@/lib/agent-colors";
import { getCrossLinks } from "@/lib/cross-links";
import { markdownToHtml } from "@/lib/markdown";

interface Props {
  agent: AgentProfile;
}

const sectionMeta: Record<string, { icon: React.ReactNode; title: string; variant: "success" | "accent" | "warning" | "default" | "cyan" }> = {
  "when to choose": { icon: <Target className="h-5 w-5" />, title: "When to choose", variant: "accent" },
  "what it does well": { icon: <Sparkles className="h-5 w-5" />, title: "What it does well", variant: "success" },
  "honest limitations": { icon: <AlertTriangle className="h-5 w-5" />, title: "Honest limitations", variant: "warning" },
  "best fit": { icon: <Users className="h-5 w-5" />, title: "Best fit", variant: "cyan" },
};

function parseDescriptionSections(content: string): { sections: Array<{ key: string; html: string }>; hasStructured: boolean } {
  const headingRegex = /^##\s+(.+)$/gim;
  const matches = Array.from(content.matchAll(headingRegex));
  if (matches.length === 0) {
    return { sections: [{ key: "overview", html: markdownToHtml(content) }], hasStructured: false };
  }

  const sections: Array<{ key: string; html: string }> = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const title = match[1].trim();
    const start = match.index! + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : content.length;
    const body = content.slice(start, end).trim();
    if (body) {
      sections.push({ key: title.toLowerCase(), html: markdownToHtml(body) });
    }
  }
  return { sections, hasStructured: true };
}

function getVariantClasses(variant: string, color: string) {
  switch (variant) {
    case "success":
      return "border-success/30 bg-success/5 text-success";
    case "warning":
      return "border-warning/30 bg-warning/5 text-warning";
    case "cyan":
      return "border-cyan/30 bg-cyan/5 text-cyan";
    case "accent":
    default:
      return "border-accent/30 bg-accent/5 text-accent";
  }
}

export default function AgentDetail({ agent }: Props) {
  const color = getAgentColor(agent.id);
  const colorStyle = { color } as React.CSSProperties;
  const { sections, hasStructured } = parseDescriptionSections(agent.description);
  const links = getCrossLinks(agent.id);

  const runtimeStyle =
    agent.runtime === "Local"
      ? "border-emerald/30 bg-emerald/5 text-emerald"
      : agent.runtime === "Cloud"
      ? "border-cyan/30 bg-cyan/5 text-cyan"
      : "border-amber/30 bg-amber/5 text-amber";

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/agents"
        className="mb-6 inline-flex items-center text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        ← Back to directory
      </Link>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        {/* Header */}
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-5">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-canvas text-3xl font-medium border-2 border-hairline"
                style={colorStyle}
              >
                {agent.name.charAt(0)}
              </div>
              <div>
                <h1
                  className="text-3xl font-semibold tracking-tight md:text-4xl"
                  style={colorStyle}
                >
                  {agent.name}
                </h1>
                <p className="mt-1 text-lg text-foreground-secondary">
                  {agent.company} · <span className="font-mono">{agent.releaseYear}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                  agent.openSource
                    ? "bg-success-muted text-success"
                    : "bg-warning-muted text-warning"
                }`}
              >
                {agent.pricing}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${runtimeStyle}`}>
                {agent.runtime}
              </span>
              {agent.multiPlatform && (
                <span className="rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                  Multi-platform
                </span>
              )}
              {agent.providerAgnostic && (
                <span className="rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                  Provider-agnostic
                </span>
              )}
            </div>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-foreground-secondary">
            {agent.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {agent.website && (
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: color }}
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {agent.repository && (
              <a
                href={agent.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-hairline-strong hover:text-cyan"
              >
                View Source
                <GitBranch className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Structured sections */}
        {hasStructured ? (
          <div className="grid gap-5 px-8 py-10 md:px-12">
            {sections.map((section) => {
              const meta = sectionMeta[section.key] || {
                icon: <Layers className="h-5 w-5" />,
                title: section.key.replace(/^\w/, (c) => c.toUpperCase()),
                variant: "default" as const,
              };
              const variantClass = getVariantClasses(meta.variant, color);
              return (
                <div
                  key={section.key}
                  className={`rounded-xl border p-6 ${variantClass.replace("text-", "border-").replace("/30", "/30 bg-elevated/30")}`}
                >
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${variantClass}`}>
                    {meta.icon}
                    <span className="text-sm font-semibold">{meta.title}</span>
                  </div>
                  <div
                    className="prose prose-invert max-w-none prose-p:text-foreground-secondary prose-strong:text-foreground prose-li:text-foreground-secondary"
                    dangerouslySetInnerHTML={{ __html: section.html }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="prose prose-invert max-w-none px-8 py-10 md:px-12"
            dangerouslySetInnerHTML={{ __html: sections[0]?.html || "" }}
          />
        )}

        {/* Spec sheet */}
        <div className="border-t border-hairline px-8 py-10 md:px-12">
          <h2 className="mb-6 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
            Spec sheet
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-hairline bg-elevated/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                <DollarSign className="h-4 w-4" />
                Pricing
              </div>
              <p className="text-lg font-medium text-foreground">{agent.pricing}</p>
            </div>
            <div className="rounded-xl border border-hairline bg-elevated/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                <Zap className="h-4 w-4" />
                Runtime
              </div>
              <p className="text-lg font-medium text-foreground">{agent.runtime}</p>
            </div>
            <div className="rounded-xl border border-hairline bg-elevated/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                <Calendar className="h-4 w-4" />
                Released
              </div>
              <p className="text-lg font-medium text-foreground">{agent.releaseYear}</p>
            </div>
            <div className="rounded-xl border border-hairline bg-elevated/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                <Globe className="h-4 w-4" />
                License
              </div>
              <p className="text-lg font-medium text-foreground">{agent.openSource ? "Open source" : "Proprietary"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Key features
              </h3>
              <ul className="space-y-3">
                {agent.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-foreground-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={colorStyle} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                Works with
              </h3>
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary font-mono">
                    Platforms
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {agent.platforms.map((p) => (
                      <span key={p} className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-sm text-foreground-secondary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                {agent.model && (
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary font-mono">
                      Default model
                    </span>
                    <div className="mt-2">
                      <span className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-sm text-foreground inline-flex items-center gap-2">
                        <Cpu className="h-3.5 w-3.5 text-foreground-tertiary" />
                        {agent.model}
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary font-mono">
                    Categories
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {agent.categories.map((c) => (
                      <span key={c} className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-sm text-foreground-secondary">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-links */}
        {links.length > 0 && (
          <div className="border-t border-hairline px-8 py-6 md:px-12">
            <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono mb-3">
              Commonly compared with
            </h2>
            <div className="flex flex-wrap gap-3">
              {links.map((link) => (
                <Link
                  key={link.targetId}
                  href={`/agents/${link.targetId}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm text-foreground transition-all hover:border-cyan/50 hover:text-cyan"
                >
                  {link.label}{" "}
                  <span className="font-medium" style={{ color }}>
                    {link.targetName}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {agent.lastVerified && (
          <div className="border-t border-hairline bg-elevated px-8 py-4 flex items-center justify-between md:px-12">
            <FreshnessBadge dateString={agent.lastVerified} />
            <span className="text-xs text-foreground-tertiary font-mono">Last verified: {agent.lastVerified}</span>
          </div>
        )}
      </div>
    </div>
  );
}
