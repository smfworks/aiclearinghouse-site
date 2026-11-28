import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostsBySeries, toBlogCard } from "@/lib/blog/loader";
import { getAllSeries, SERIES_LABELS, type BlogSeries } from "@/lib/blog/types";
import { paginatePosts, POSTS_PER_PAGE } from "@/lib/blog/pagination";
import BlogCard from "@/components/BlogCard";
import BlogPagination from "@/components/BlogPagination";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  const params: { series: string; page: string }[] = [];
  for (const series of getAllSeries()) {
    const total = getBlogPostsBySeries(series).length;
    const pages = Math.ceil(total / POSTS_PER_PAGE);
    for (let page = 2; page <= pages; page += 1) {
      params.push({ series, page: String(page) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string; page: string }>;
}): Promise<Metadata> {
  const { series, page } = await params;
  const label = SERIES_LABELS[series as BlogSeries]?.label || "Series";
  return { title: `${label} — page ${page} | SMF Clearinghouse` };
}

export default async function SeriesPaged({
  params,
}: {
  params: Promise<{ series: string; page: string }>;
}) {
  const { series: requested, page } = await params;
  if (!getAllSeries().includes(requested as BlogSeries)) notFound();
  const series = requested as BlogSeries;
  const active = SERIES_LABELS[series];
  const pageNum = Number.parseInt(page, 10);
  if (!Number.isFinite(pageNum) || pageNum < 2) notFound();
  const allPosts = getBlogPostsBySeries(series);
  const { posts, currentPage, totalPages, totalPosts } = paginatePosts(allPosts, pageNum);
  if (pageNum > totalPages) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 bg-canvas">
        <div className="bg-workshop-masthead relative overflow-hidden border-b border-hairline">
          <div className="bg-workshop-grid pointer-events-none absolute inset-0 opacity-65" aria-hidden="true" />
          <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-6 py-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-px w-6 bg-accent" aria-hidden="true" />
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  SMF Clearinghouse
                </p>
              </div>
              <span className="rounded-full border border-hairline-strong bg-elevated/80 px-3.5 py-1 font-mono text-xs text-foreground-secondary">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
              {active.label}
            </h1>
            <p className="mt-3 max-w-2xl text-foreground-secondary">{active.description}</p>
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
            basePath={`/blog/series/${series}`}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
