import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";
import { ArrowLeft } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface Props {
  item: MarketplaceItem | null | undefined;
  section: string;
  sectionTitle: string;
  backHref: string;
}

export default function SectionDetail({ item, section, sectionTitle, backHref }: Props) {
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {sectionTitle.toLowerCase()}
      </Link>

      <article className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        <div className="flex flex-col gap-6 border-b border-hairline bg-elevated p-8 md:flex-row md:items-start md:p-12">
          {item.image && (
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-hairline md:w-1/3">
              <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex-1">
            <span className="text-xs font-medium uppercase tracking-wider text-accent font-mono">
              {item.category}
            </span>
            <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{item.title}</h1>
            <p className="mt-4 text-lg text-foreground-secondary">{item.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-hairline px-3 py-1 text-xs text-foreground-tertiary"
                >
                  {tag}
                </span>
              ))}
            </div>
            {item.last_verified && (
              <div className="mt-4">
                <FreshnessBadge dateString={item.last_verified} />
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-invert max-w-none px-8 py-10 md:px-12">
          {(item.for || item.author || item.install || (item.dependencies && item.dependencies.length > 0) || item.source) && (
            <div className="not-prose mb-10 rounded-xl border border-hairline bg-elevated p-6">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Skill details</h2>
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                {item.for && (
                  <div>
                    <dt className="text-foreground-tertiary">For</dt>
                    <dd className="mt-1 font-medium text-foreground">{item.for}</dd>
                  </div>
                )}
                {item.author && (
                  <div>
                    <dt className="text-foreground-tertiary">Author</dt>
                    <dd className="mt-1 font-medium text-foreground">{item.author}</dd>
                  </div>
                )}
                {item.install && (
                  <div className="sm:col-span-2">
                    <dt className="text-foreground-tertiary">Install</dt>
                    <dd className="mt-1 rounded-lg border border-hairline bg-canvas px-3 py-2 font-mono text-foreground">{item.install}</dd>
                  </div>
                )}
                {item.dependencies && item.dependencies.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-foreground-tertiary">Dependencies</dt>
                    <dd className="mt-1">
                      <ul className="list-disc pl-4 text-foreground">
                        {item.dependencies.map((dep: string) => (
                          <li key={dep}>{dep}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                {item.source && (
                  <div className="sm:col-span-2">
                    <dt className="text-foreground-tertiary">Source</dt>
                    <dd className="mt-1">
                      <Link
                        href={item.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-accent hover:underline"
                      >
                        {item.source}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }} />
        </div>
      </article>
    </div>
  );
}
