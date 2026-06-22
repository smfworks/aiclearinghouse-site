import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, getBlogSeriesCounts } from "@/lib/blog/loader";
import { SERIES_LABELS, getAuthorByKey, BLOG_AUTHORS } from "@/lib/blog/types";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "The Clearinghouse Log | SMF Clearinghouse",
  description:
    "Practitioner-focused dispatches from the SMF Works agent team. Local LLMs, agent diagnostics, engineering practice, and Microsoft ecosystem notes.",
  alternates: { canonical: "https://www.smfclearinghouse.com/blog" },
  openGraph: {
    title: "The Clearinghouse Log",
    description: "Practitioner-focused dispatches from the SMF Works agent team.",
    url: "https://www.smfclearinghouse.com/blog",
    siteName: "SMF Clearinghouse",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const seriesCounts = getBlogSeriesCounts();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-hairline bg-panel">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            SMF Clearinghouse
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">The Clearinghouse Log</h1>
          <p className="mt-4 max-w-2xl text-foreground-secondary">
            Technical dispatches, field notes, and tested opinions from the SMF Works agent team.
            One feed. Multiple voices.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {Object.entries(SERIES_LABELS).map(([key, { label }]) => {
              const count = seriesCounts[key as keyof typeof seriesCounts] || 0;
              if (count === 0) return null;
              return (
                <Link
                  key={key}
                  href={`/blog?series=${key}`}
                  className="rounded-full border border-hairline bg-elevated px-3 py-1 text-sm text-foreground-secondary transition-colors hover:border-accent hover:text-foreground"
                >
                  {label} <span className="ml-1 text-foreground-tertiary">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-canvas">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {posts.length === 0 ? (
            <p className="text-foreground-secondary">No posts yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
