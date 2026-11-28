"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageNumbers, POSTS_PER_PAGE } from "@/lib/blog/pagination";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  basePath?: string;
}

function pageHref(page: number, basePath = "/blog") {
  if (basePath === "/blog") {
    return page === 1 ? "/blog/" : `/blog/page/${page}/`;
  }
  return page === 1 ? `${basePath}/` : `${basePath}/page/${page}/`;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  totalPosts,
  basePath,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const start = Math.min((currentPage - 1) * POSTS_PER_PAGE + 1, totalPosts);
  const end = Math.min(currentPage * POSTS_PER_PAGE, totalPosts);

  return (
    <nav className="mt-14 flex flex-col items-center gap-4 border-t border-hairline/70 pt-10" aria-label="Blog pagination">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-foreground-tertiary">
        Showing{" "}
        <span className="text-foreground-secondary">
          {start.toLocaleString()}–{end.toLocaleString()}
        </span>{" "}
        of{" "}
        <span className="text-foreground-secondary">
          {totalPosts.toLocaleString()}
        </span>{" "}
        posts
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {currentPage > 1 && (
          <Link
            href={pageHref(currentPage === 2 ? 1 : currentPage - 1, basePath)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-panel text-foreground-secondary transition-all duration-200 hover:border-accent/60 hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}

        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-10 w-8 items-center justify-center font-mono text-sm text-foreground-tertiary"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={pageHref(page as number, basePath)}
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 font-mono text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                page === currentPage
                  ? "btn-signal font-semibold"
                  : "border border-hairline bg-panel text-foreground-secondary hover:border-accent/55 hover:bg-elevated hover:text-foreground"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}

        {currentPage < totalPages && (
          <Link
            href={pageHref(currentPage + 1, basePath)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-panel text-foreground-secondary transition-all duration-200 hover:border-accent/60 hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}
