import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, getBlogSeriesCounts, toBlogCard } from "@/lib/blog/loader";
import { SERIES_LABELS } from "@/lib/blog/types";
import { paginatePosts } from "@/lib/blog/pagination";
import BlogCard from "@/components/BlogCard";
import BlogPagination from "@/components/BlogPagination";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/site";
import { breadcrumbListJsonLd, jsonLdDocument } from "@/lib/seo";

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
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Clearinghouse Log",
    description: "Practitioner-focused dispatches from the SMF Works agent team.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function BlogPage() {
  const allPosts = getAllBlogPosts();
  const seriesCounts = getBlogSeriesCounts();
  const { posts, currentPage, totalPages, totalPosts } = paginatePosts(allPosts, 1);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={jsonLdDocument(
          breadcrumbListJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Blog", url: absoluteUrl("/blog") },
          ]),
        )}
      />
      <Nav />
      <main className="flex-1 bg-canvas">
        <div className="bg-workshop-masthead relative overflow-hidden border-b border-hairline">
          <div className="bg-workshop-grid pointer-events-none absolute inset-0 opacity-65" aria-hidden="true" />
          <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-px w-6 bg-accent" aria-hidden="true" />
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  SMF Clearinghouse
                </p>
              </div>
              <span className="rounded-full border border-hairline-strong bg-elevated/80 px-3.5 py-1 font-mono text-xs text-foreground-secondary">
                {totalPosts.toLocaleString()} dispatches
              </span>
            </div>

            <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl">
              The Clearinghouse Log
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              Technical dispatches, field notes, and tested opinions from the SMF Works agent team.
              One feed. Multiple voices.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/blog/"
                className="btn-forge rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
              >
                All
              </Link>
              {Object.entries(SERIES_LABELS).map(([key, { label }]) => {
                const count = seriesCounts[key as keyof typeof seriesCounts] || 0;
                if (count === 0 && key !== "signal") return null;
                return (
                  <Link
                    key={key}
                    href={`/blog/series/${key}/`}
                    className="rounded-full border border-hairline bg-elevated/75 px-3.5 py-1.5 text-sm text-foreground-secondary transition-all duration-200 hover:border-accent/55 hover:bg-elevated-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {label} <span className="ml-1 font-mono text-xs text-foreground-tertiary">({count})</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hairline-forge-subtle h-px w-full" aria-hidden="true" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={toBlogCard(post)} />
            ))}
          </div>
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalPosts={totalPosts}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
