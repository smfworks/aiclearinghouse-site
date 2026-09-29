import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostsBySeries, getBlogSeriesCounts } from "@/lib/blog/loader";
import { getAllSeries, SERIES_LABELS, type BlogSeries } from "@/lib/blog/types";
import { paginatePosts } from "@/lib/blog/pagination";
import BlogCard from "@/components/BlogCard";
import BlogPagination from "@/components/BlogPagination";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return getAllSeries().map((series) => ({ series }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series } = await params;
  const label = SERIES_LABELS[series as BlogSeries]?.label || "Series";
  return {
    title: `${label} | SMF Clearinghouse`,
    description: SERIES_LABELS[series as BlogSeries]?.description,
    alternates: { canonical: `https://www.smfclearinghouse.com/blog/series/${series}` },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series: requested } = await params;
  if (!getAllSeries().includes(requested as BlogSeries)) notFound();
  const series = requested as BlogSeries;
  const active = SERIES_LABELS[series];
  const allPosts = getBlogPostsBySeries(series);
  const seriesCounts = getBlogSeriesCounts();
  const { posts, currentPage, totalPages, totalPosts } = paginatePosts(allPosts, 1);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <header className="border-b border-hairline bg-panel">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            SMF Clearinghouse
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{active.label}</h1>
          <p className="mt-4 max-w-2xl text-foreground-secondary">{active.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="rounded-full border border-hairline bg-elevated px-3 py-1 text-sm text-foreground-secondary hover:border-accent hover:text-foreground"
            >
              All
            </Link>
            {Object.entries(SERIES_LABELS).map(([key, { label }]) => {
              const count = seriesCounts[key as keyof typeof seriesCounts] || 0;
              if (count === 0 && key !== "signal") return null;
              const on = series === key;
              return (
                <Link
                  key={key}
                  href={`/blog/series/${key}`}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    on
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-hairline bg-elevated text-foreground-secondary hover:border-accent hover:text-foreground"
                  }`}
                >
                  {label} <span className="ml-1 opacity-70">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      <main className="flex-1 bg-canvas">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {posts.length === 0 ? (
            <p className="text-foreground-secondary">
              {series === "signal"
                ? "New Signal how-tos land here. The archive is still on smfworks.com/publications/the-signal until those posts move."
                : "No posts in this series yet."}
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalPosts={totalPosts}
                basePath={`/blog/series/${series}`}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
