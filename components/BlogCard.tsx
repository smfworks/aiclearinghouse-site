"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BlogCardData, getAuthorByKey, SERIES_LABELS } from "@/lib/blog/types";

interface BlogCardProps {
  post: BlogCardData;
}

export default function BlogCard({ post }: BlogCardProps) {
  const author = getAuthorByKey(post.authorKey);
  const series = SERIES_LABELS[post.series];

  return (
    <article className="card-workshop group relative flex flex-col overflow-hidden rounded-2xl border border-hairline transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      {post.image && (
        <Link
          href={`/blog/${post.slug}/`}
          className="relative block h-48 overflow-hidden bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/25 to-transparent" />
          <div
            className="absolute inset-0 ring-1 ring-inset ring-white/5"
            aria-hidden="true"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          {series && (
            <Link
              href={`/blog/?series=${post.series}`}
              className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide text-accent transition-colors hover:border-accent/55 hover:bg-accent/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {series.label}
            </Link>
          )}
          <time
            dateTime={post.date}
            className="font-mono text-[11px] uppercase tracking-wider text-foreground-tertiary"
          >
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>
        </div>

        <h2 className="font-display text-[1.3rem] font-semibold leading-[1.26] tracking-[-0.015em] text-foreground">
          <Link
            href={`/blog/${post.slug}/`}
            className="inline-flex items-baseline gap-1 transition-colors duration-200 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            <span>{post.title}</span>
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-foreground-secondary">
            {post.excerpt}
          </p>
        )}

        <div className="mt-5 flex items-center gap-2.5 border-t border-hairline/75 pt-4">
          {author && (
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#050608] ring-2 ring-panel"
              style={{ backgroundColor: author.color }}
              aria-hidden="true"
            >
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <span className="truncate text-sm font-medium text-foreground-secondary">
            {post.author}
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {post.readTime > 0 && (
              <span className="font-mono text-[11px] text-foreground-tertiary">
                {post.readTime} min
              </span>
            )}
            <ArrowUpRight
              className="h-3.5 w-3.5 text-foreground-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
