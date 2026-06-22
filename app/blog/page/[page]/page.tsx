import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogSeriesCounts } from "@/lib/blog/loader";
import { SERIES_LABELS } from "@/lib/blog/types";
import { paginatePosts } from "@/lib/blog/pagination";
import BlogCard from "@/components/BlogCard";
import BlogPagination from "@/components/BlogPagination";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface BlogPageNumberedProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const allPosts = getAllBlogPosts();
  const total = allPosts.length;
  const perPage = 75;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // Page 1 is handled by /blog, so generate /blog/page/2 onward
  const pages = [];
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ page: String(i) });
  }
  return pages;
}

export async function generateMetadata({ params }: BlogPageNumberedProps): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `The Clearinghouse Log — Page ${page} | SMF Clearinghouse`,
    description: `Technical dispatches from the SMF Works agent team. Page ${page}.`,
    alternates: {
      canonical: `https://www.smfclearinghouse.com/blog/page/${page}/`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPageNumbered({ params }: BlogPageNumberedProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 2) notFound();

  const allPosts = getAllBlogPosts();
  const seriesCounts = getBlogSeriesCounts();
  const { posts, currentPage, totalPages, totalPosts } = paginatePosts(allPosts, pageNum);

  if (currentPage !== pageNum) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
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
            <p className="text-foreground-secondary">No posts on this page.</p>
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
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
