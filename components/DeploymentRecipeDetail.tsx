import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";
import {
  ArrowLeft,
  Clock,
  Gauge,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  ArrowRight,
  ListChecks,
  FlaskConical,
  Wrench,
} from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  item: MarketplaceItem | null | undefined;
}

const difficultyStyles: Record<string, string> = {
  Beginner: "text-emerald border-emerald/30 bg-emerald/5",
  Easy: "text-emerald border-emerald/30 bg-emerald/5",
  Intermediate: "text-amber border-amber/30 bg-amber/5",
  Advanced: "text-rose border-rose/30 bg-rose/5",
};

const sectionMeta: Record<string, { icon: React.ReactNode; title: string; variant: string }> = {
  "the promise": { icon: <FlaskConical className="h-5 w-5" />, title: "The promise", variant: "accent" },
  "what you'll get": { icon: <CheckCircle2 className="h-5 w-5" />, title: "What you'll get", variant: "success" },
  "prerequisites": { icon: <ListChecks className="h-5 w-5" />, title: "Prerequisites", variant: "warning" },
  "sanity checks": { icon: <CheckCircle2 className="h-5 w-5" />, title: "Sanity checks", variant: "success" },
  "troubleshooting": { icon: <Wrench className="h-5 w-5" />, title: "Troubleshooting", variant: "warning" },
  "next step": { icon: <ArrowRight className="h-5 w-5" />, title: "Next step", variant: "cyan" },
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

export default function DeploymentRecipeDetail({ item }: Props) {
  if (!item) return null;

  const sections = parseSections(item.content);
  const difficulty = String(item.difficulty || "Intermediate");
  const estimatedTime = String(item.estimated_time || "30 min");
  const difficultyClass = difficultyStyles[difficulty] || difficultyStyles.Intermediate;

  // Identify step sections ("Step 1", "Step 2", etc.) and group them.
  const stepSections = sections.filter((s) => /^step \d+/.test(s.key));
  const nonStepSections = sections.filter((s) => !/^step \d+/.test(s.key));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/deployment-recipes"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to recipes
      </Link>

      <article className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        {/* Header */}
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber">
              <Terminal className="h-3.5 w-3.5" />
              {item.category}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyClass}`}>
              <Gauge className="h-3.5 w-3.5" />
              {difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground-secondary">
              <Clock className="h-3.5 w-3.5" />
              {estimatedTime}
            </span>
            {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-foreground-secondary">{item.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-hairline bg-canvas px-3 py-1 text-xs text-foreground-tertiary">
                <Tag className="mr-1 inline h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Non-step sections */}
        <div className="grid gap-5 px-8 py-10 md:px-12">
          {nonStepSections.map((section) => {
            const meta = sectionMeta[section.key] || {
              icon: <Terminal className="h-5 w-5" />,
              title: section.key.replace(/^\w/, (c) => c.toUpperCase()),
              variant: "default",
            };
            const variantClass = getVariantClasses(meta.variant);
            const isPrereqs = section.key === "prerequisites";

            return (
              <div key={section.key} className="rounded-xl border border-hairline bg-elevated/30 p-6">
                <div className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${variantClass}`}>
                  {meta.icon}
                  <span className="text-sm font-semibold">{meta.title}</span>
                </div>
                <div
                  className={`prose prose-invert max-w-none prose-p:text-foreground-secondary prose-strong:text-foreground prose-li:text-foreground-secondary ${
                    isPrereqs ? "prose-ul:space-y-2" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </div>
            );
          })}
        </div>

        {/* Step sections */}
        {stepSections.length > 0 && (
          <div className="border-t border-hairline px-8 py-10 md:px-12">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
              <ListChecks className="h-4 w-4" />
              Steps
            </h2>
            <div className="space-y-6">
              {stepSections.map((section, idx) => (
                <div
                  key={section.key}
                  className="relative rounded-xl border border-hairline bg-elevated/30 p-6 pl-14"
                >
                  <div className="absolute left-4 top-6 flex h-8 w-8 items-center justify-center rounded-lg border border-amber/30 bg-amber/10 text-sm font-semibold text-amber">
                    {idx + 1}
                  </div>
                  <div
                    className="prose prose-invert max-w-none prose-p:text-foreground-secondary prose-strong:text-foreground prose-li:text-foreground-secondary"
                    dangerouslySetInnerHTML={{ __html: section.html }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="border-t border-hairline bg-elevated px-8 py-6 md:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground-secondary">
              Recipe verified <span className="font-mono text-foreground">{item.last_verified || "recently"}</span>.
              Commands are tested but your environment may differ.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber transition-colors hover:text-amber-hover"
            >
              Browse related services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
