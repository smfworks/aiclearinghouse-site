import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MarketplaceItem } from "@/lib/marketplace/types";
import { markdownToHtml } from "@/lib/markdown";

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
      <Link href={backHref} className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        ← Back to {sectionTitle.toLowerCase()}
      </Link>

      <article className="rounded-2xl border border-border bg-card p-8 md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {item.image && (
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl md:w-1/3">
              <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex-1">
            <span className="text-sm font-semibold text-primary">{item.category}</span>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{item.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{item.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{tag}</span>
              ))}
            </div>
            {item.last_verified && <p className="mt-4 text-xs text-muted-foreground">Last verified: {item.last_verified}</p>}
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }} />
        </div>
      </article>
    </div>
  );
}
