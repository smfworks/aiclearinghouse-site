import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, getBlogSeriesCounts } from "@/lib/blog/loader";
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
      <div className="border-b border-hairline bg-panel">
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
            <Link
              href="/blog"
              className="rounded-full border border-accent bg-accent px-3 py-1 text-sm text-accent-foreground"
            >
              All
            </Link>
            {Object.entries(SERIES_LABELS).map(([key, { label }]) => {
              const count = seriesCounts[key as keyof typeof seriesCounts] || 0;
              if (count === 0 && key !== "signal") return null;
              return (
                <Link
                  key={key}
                  href={`/blog/series/${key}`}
                  className="rounded-full border border-hairline bg-elevated px-3 py-1 text-sm text-foreground-secondary transition-colors hover:border-accent hover:text-foreground"
                >
                  {label} <span className="ml-1">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
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
