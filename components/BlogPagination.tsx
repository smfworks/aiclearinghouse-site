"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageNumbers, POSTS_PER_PAGE } from "@/lib/blog/pagination";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  totalPosts,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="mt-12 flex flex-col items-center gap-4" aria-label="Blog pagination">
      <p className="text-sm text-foreground-tertiary">
        Showing {Math.min((currentPage - 1) * POSTS_PER_PAGE + 1, totalPosts)}–
        {Math.min(currentPage * POSTS_PER_PAGE, totalPosts)} of {totalPosts} posts
      </p>

      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link
            href={currentPage === 2 ? "/blog/" : `/blog/page/${currentPage - 1}/`}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-foreground-secondary transition-colors hover:border-accent hover:text-foreground"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}

        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 items-center justify-center text-foreground-tertiary"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={page === 1 ? "/blog/" : `/blog/page/${page}/`}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-accent text-accent-foreground"
                  : "border border-hairline text-foreground-secondary hover:border-accent hover:text-foreground"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}

        {currentPage < totalPages && (
          <Link
            href={`/blog/page/${currentPage + 1}/`}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-foreground-secondary transition-colors hover:border-accent hover:text-foreground"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}
