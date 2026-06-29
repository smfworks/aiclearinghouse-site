import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";
import {
  ArrowLeft,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle2,
  Rocket,
  Zap,
  Tag,
  Workflow,
  Shield,
  DollarSign,
} from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  item: MarketplaceItem | null | undefined;
}

const sectionMeta: Record<string, { icon: React.ReactNode; title: string; variant: string }> = {
  "the principle": { icon: <Lightbulb className="h-5 w-5" />, title: "The principle", variant: "accent" },
  "why it matters": { icon: <Target className="h-5 w-5" />, title: "Why it matters", variant: "cyan" },
  "how to apply it": { icon: <CheckCircle2 className="h-5 w-5" />, title: "How to apply it", variant: "success" },
  "red flags": { icon: <AlertTriangle className="h-5 w-5" />, title: "Red flags", variant: "warning" },
  "quick win": { icon: <Rocket className="h-5 w-5" />, title: "Quick win", variant: "accent" },
};

const categoryIcons: Record<string, React.ReactNode> = {
  Workflow: <Workflow className="h-4 w-4" />,
  Quality: <CheckCircle2 className="h-4 w-4" />,
  Safety: <Shield className="h-4 w-4" />,
  Cost: <DollarSign className="h-4 w-4" />,
  Hermes: <Zap className="h-4 w-4" />,
  Tip: <Lightbulb className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  Workflow: "text-cyan border-cyan/30 bg-cyan/5",
  Quality: "text-emerald border-emerald/30 bg-emerald/5",
  Safety: "text-rose border-rose/30 bg-rose/5",
  Cost: "text-amber border-amber/30 bg-amber/5",
  Hermes: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Tip: "text-accent border-accent/30 bg-accent/5",
};

function parseSections(content: string): Array<{ key: string; html: string }> {
  const headingRegex = /^##\s+(.+)$/gim;
  const matches = Array.from(content.matchAll(headingRegex));
  if (matches.length === 0) {
    return [{ key: "overview", html: markdownToHtml(content) }];
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
  return sections;
}

function getVariantClasses(variant: string) {
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

export default function TipDetail({ item }: Props) {
  if (!item) return null;

  const sections = parseSections(item.content);
  const colorClass = categoryColors[item.category] || categoryColors.Tip;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/tips"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tips
      </Link>

      <article className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        {/* Header */}
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
              {categoryIcons[item.category] || <Lightbulb className="h-3.5 w-3.5" />}
              {item.category}
            </span>
            {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-foreground-secondary">{item.excerpt}</p>
        </div>

        {/* Structured sections */}
        <div className="grid gap-5 px-8 py-10 md:px-12">
          {sections.map((section) => {
            const meta = sectionMeta[section.key] || {
              icon: <Lightbulb className="h-5 w-5" />,
              title: section.key.replace(/^\w/, (c) => c.toUpperCase()),
              variant: "default",
            };
            const variantClass = getVariantClasses(meta.variant);
            return (
              <div
                key={section.key}
                className={`rounded-xl border border-hairline bg-elevated/30 p-6 ${
                  section.key === "quick win" ? "border-accent/40 bg-accent/5" : ""
                }`}
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

        {/* Tags footer */}
        <div className="border-t border-hairline bg-elevated px-8 py-4 md:px-12">
          <div className="flex flex-wrap items-center gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-hairline bg-canvas px-3 py-1 text-xs text-foreground-tertiary">
                <Tag className="mr-1 inline h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
