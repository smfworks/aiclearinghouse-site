import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";
import { ArrowLeft, ExternalLink, DollarSign, Clock, Tag, Building2, Globe, CheckCircle2, AlertTriangle, Sparkles, Users } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  item: MarketplaceItem | null | undefined;
}

const sectionMeta: Record<string, { icon: React.ReactNode; title: string; variant: string }> = {
  "what it is": { icon: <Sparkles className="h-5 w-5" />, title: "What it is", variant: "accent" },
  "when to use it": { icon: <Users className="h-5 w-5" />, title: "When to use it", variant: "cyan" },
  "what it does well": { icon: <CheckCircle2 className="h-5 w-5" />, title: "What it does well", variant: "success" },
  "what it covers": { icon: <CheckCircle2 className="h-5 w-5" />, title: "What it covers", variant: "success" },
  "deliverable": { icon: <CheckCircle2 className="h-5 w-5" />, title: "Deliverable", variant: "success" },
  "honest limitations": { icon: <AlertTriangle className="h-5 w-5" />, title: "Honest limitations", variant: "warning" },
  "pricing reality": { icon: <DollarSign className="h-5 w-5" />, title: "Pricing reality", variant: "default" },
  "best fit": { icon: <Users className="h-5 w-5" />, title: "Best fit", variant: "cyan" },
  "common integrations": { icon: <Globe className="h-5 w-5" />, title: "Common integrations", variant: "default" },
};

const categoryColors: Record<string, string> = {
  Infrastructure: "text-cyan border-cyan/30 bg-cyan/5",
  Data: "text-emerald border-emerald/30 bg-emerald/5",
  Security: "text-rose border-rose/30 bg-rose/5",
  Operations: "text-violet border-violet/30 bg-violet/5",
  "AI APIs": "text-amber border-amber/30 bg-amber/5",
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
      return "border-accent/30 bg-accent/5 text-accent";
    default:
      return "border-hairline bg-elevated/30 text-foreground-secondary";
  }
}

export default function ServiceDetail({ item }: Props) {
  if (!item) return null;

  const sections = parseSections(item.content);
  const catColor = categoryColors[item.category] || "border-hairline bg-elevated/30 text-foreground-secondary";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to services
      </Link>

      <article className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        {/* Header */}
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${catColor}`}>
              <Tag className="h-3.5 w-3.5" />
              {item.category}
            </span>
            {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-foreground-secondary">{item.excerpt}</p>

          {/* Quick facts */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {item.provider && (
              <div className="rounded-xl border border-hairline bg-canvas p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                  <Building2 className="h-4 w-4" />
                  Provider
                </div>
                <p className="font-medium text-foreground">{item.provider}</p>
              </div>
            )}
            {item.pricing_model && (
              <div className="rounded-xl border border-hairline bg-canvas p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                  <Tag className="h-4 w-4" />
                  Pricing model
                </div>
                <p className="font-medium text-foreground">{item.pricing_model}</p>
              </div>
            )}
            {item.price && (
              <div className="rounded-xl border border-hairline bg-canvas p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                  <DollarSign className="h-4 w-4" />
                  Price
                </div>
                <p className="font-medium text-foreground">{item.price}</p>
              </div>
            )}
            {item.last_verified && (
              <div className="rounded-xl border border-hairline bg-canvas p-4">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                  <Clock className="h-4 w-4" />
                  Verified
                </div>
                <p className="font-medium text-foreground">{item.last_verified}</p>
              </div>
            )}
          </div>

          {item.website && (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:bg-accent-hover"
            >
              Visit {item.provider || "website"}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Structured sections */}
        <div className="grid gap-5 px-8 py-10 md:px-12">
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
