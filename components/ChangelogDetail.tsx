import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";
import { ArrowLeft, Calendar, Bot, ExternalLink, Tag } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  item: MarketplaceItem | null | undefined;
}

export default function ChangelogDetail({ item }: Props) {
  if (!item) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/changelog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to changelog
      </Link>

      <article className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan">
              <Bot className="h-3.5 w-3.5" />
              {item.category}
            </span>
            {item.last_verified && <FreshnessBadge dateString={item.last_verified} />}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-foreground-secondary">{item.excerpt}</p>

          {item.last_updated && (
            <div className="mt-6 flex items-center gap-2 text-sm text-foreground-secondary">
              <Calendar className="h-4 w-4" />
              Last updated: <span className="font-mono text-foreground">{String(item.last_updated).split("T")[0]}</span>
            </div>
          )}
        </div>

        <div
          className="prose prose-invert max-w-none px-8 py-10 md:px-12"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }}
        />

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
