"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog/types";
import { getAuthorByKey, SERIES_LABELS } from "@/lib/blog/types";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const author = getAuthorByKey(post.authorKey);
  const series = SERIES_LABELS[post.series];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-panel transition-colors hover:border-accent/50">
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="relative block h-44 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-foreground-tertiary">
          {series && (
            <Link
              href={`/blog?series=${post.series}`}
              className="rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent"
            >
              {series.label}
            </Link>
          )}
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>

        <h2 className="text-lg font-semibold leading-snug tracking-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-foreground-secondary">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          {author && (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: author.color }}
            >
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <span className="text-sm text-foreground-secondary">{post.author}</span>
          {post.readTime > 0 && (
            <span className="ml-auto text-xs text-foreground-tertiary">{post.readTime} min</span>
          )}
        </div>
      </div>
    </article>
  );
}
