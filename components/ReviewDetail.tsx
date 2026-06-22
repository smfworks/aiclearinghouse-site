import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";
import { ArrowLeft, ExternalLink, Star, Tag, Clock, User, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  item: MarketplaceItem | null | undefined;
}

const sectionMeta: Record<string, { icon: React.ReactNode; title: string; variant: string }> = {
  "what we tested": { icon: <Sparkles className="h-5 w-5" />, title: "What we tested", variant: "accent" },
  "what it does well": { icon: <CheckCircle2 className="h-5 w-5" />, title: "What it does well", variant: "success" },
  "honest limitations": { icon: <AlertTriangle className="h-5 w-5" />, title: "Honest limitations", variant: "warning" },
  "who it's for": { icon: <User className="h-5 w-5" />, title: "Who it's for", variant: "cyan" },
  "verdict": { icon: <Star className="h-5 w-5" />, title: "Verdict", variant: "accent" },
};

const categoryColors: Record<string, string> = {
  Agent: "text-cyan border-cyan/30 bg-cyan/5",
  Service: "text-violet border-violet/30 bg-violet/5",
  Hardware: "text-amber border-amber/30 bg-amber/5",
  Tool: "text-emerald border-emerald/30 bg-emerald/5",
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

export default function ReviewDetail({ item }: Props) {
  if (!item) return null;

  const sections = parseSections(item.content);
  const catColor = categoryColors[item.category] || "border-hairline bg-elevated/30 text-foreground-secondary";
  const rating = typeof item.rating === "number" ? item.rating : undefined;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/reviews"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to reviews
      </Link>

      <article className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        {/* Header */}
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${catColor}`}>
              <Tag className="h-3.5 w-3.5" />
              {item.category}
            </span>
            {rating !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-semibold text-foreground-secondary">
                <Star className="h-3.5 w-3.5 text-amber" />
                {rating.toFixed(1)} / 5
              </span>
            )}
            {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-foreground-secondary">{item.excerpt}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {item.product && (
              <div className="rounded-xl border border-hairline bg-canvas p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                  <Tag className="h-4 w-4" />
                  Product
                </div>
                <p className="font-medium text-foreground">{String(item.product)}</p>
              </div>
            )}
            {item.tested_by && (
              <div className="rounded-xl border border-hairline bg-canvas p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                  <User className="h-4 w-4" />
                  Reviewed by
                </div>
                <p className="font-medium text-foreground">{String(item.tested_by)}</p>
              </div>
            )}
            {item.last_verified && (
              <div className="rounded-xl border border-hairline bg-canvas p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                  <Clock className="h-4 w-4" />
                  Verified
                </div>
                <p className="font-medium text-foreground">{String(item.last_verified)}</p>
              </div>
            )}
          </div>

          {item.url && (
            <a
              href={String(item.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:bg-accent-hover"
            >
              Visit product page
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Structured sections */}
        <div className="grid gap-5 px-8 py-10 md:px-12">
          {item.x_embed && (
            <div
              className="rounded-xl border border-hairline bg-canvas p-4"
              dangerouslySetInnerHTML={{ __html: String(item.x_embed) }}
            />
          )}

          {sections.map((section) => {
            const meta = sectionMeta[section.key] || {
              icon: <Sparkles className="h-5 w-5" />,
              title: section.key.replace(/^\w/, (c) => c.toUpperCase()),
              variant: "default",
            };
            const variantClass = getVariantClasses(meta.variant);
            return (
              <div
                key={section.key}
                className="rounded-xl border border-hairline bg-elevated/30 p-6"
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
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
