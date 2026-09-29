import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostsBySeries } from "@/lib/blog/loader";
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
  const pageNum = Number.parseInt(page, 10);
  if (!Number.isFinite(pageNum) || pageNum < 2) notFound();
  const allPosts = getBlogPostsBySeries(series);
  const { posts, currentPage, totalPages, totalPosts } = paginatePosts(allPosts, pageNum);
  if (pageNum > totalPages) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 bg-canvas">
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
            basePath={`/blog/series/${series}`}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
