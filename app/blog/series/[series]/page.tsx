import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostsBySeries, getBlogSeriesCounts, toBlogCard } from "@/lib/blog/loader";
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
      <main className="flex-1 bg-canvas">
        <div className="bg-rd-masthead relative overflow-hidden border-b border-hairline">
          <div className="bg-rd-grid pointer-events-none absolute inset-0 opacity-65" aria-hidden="true" />
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
                {totalPosts.toLocaleString()} {totalPosts === 1 ? "dispatch" : "dispatches"}
              </span>
            </div>

            <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl">
              {active.label}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
              {active.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/blog/"
                className="rounded-full border border-hairline bg-elevated/75 px-3.5 py-1.5 text-sm text-foreground-secondary transition-all duration-200 hover:border-accent/55 hover:bg-elevated-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                    href={`/blog/series/${key}/`}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      on
                        ? "btn-signal font-semibold"
                        : "border border-hairline bg-elevated/75 text-foreground-secondary hover:border-accent/55 hover:bg-elevated-hover hover:text-foreground"
                    }`}
                  >
                    {label}{" "}
                    <span
                      className={`ml-1 font-mono text-xs ${
                        on ? "text-accent-foreground/80" : "text-foreground-tertiary"
                      }`}
                    >
                      ({count})
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hairline-signal-subtle h-px w-full" aria-hidden="true" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12">
          {posts.length === 0 ? (
            <div className="card-rd rounded-2xl border border-hairline p-8 text-foreground-secondary">
              {series === "signal"
                ? "New Signal how-tos land here. The archive is still on smfworks.com/publications/the-signal until those posts move."
                : "No posts in this series yet."}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={toBlogCard(post)} />
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
