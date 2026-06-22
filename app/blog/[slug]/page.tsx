import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog/loader";

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorByKey, SERIES_LABELS } from "@/lib/blog/types";
import { marked } from "marked";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found | SMF Clearinghouse" };

  return {
    title: `${post.title} | SMF Clearinghouse`,
    description: post.excerpt,
    alternates: { canonical: post.canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: post.canonicalUrl,
      siteName: "SMF Clearinghouse",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: `https://www.smfclearinghouse.com${post.image}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [`https://www.smfclearinghouse.com${post.image}`] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthorByKey(post.authorKey);
  const series = SERIES_LABELS[post.series];
  const html = await marked(post.content);

  return (
    <div className="flex min-h-screen flex-col">
      <article className="flex-1 bg-canvas">
        <header className="border-b border-hairline bg-panel">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              {series && (
                <Link
                  href={`/blog?series=${post.series}`}
                  className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent"
                >
                  {series.label}
                </Link>
              )}
              <time className="text-foreground-tertiary" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-4 text-lg text-foreground-secondary">{post.excerpt}</p>
            )}
            <div className="mt-6 flex items-center gap-3">
              {author && (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: author.color }}
                >
                  {author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">{post.author}</p>
                {author && (
                  <p className="text-sm text-foreground-secondary">{author.role}</p>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12">
          {post.image && (
            <div className="mb-10 overflow-hidden rounded-xl border border-hairline">
              <img
                src={post.image}
                alt={post.title}
                className="w-full object-cover"
                width={1200}
                height={630}
              />
            </div>
          )}

          <div
            className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-accent hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {post.originalUrl && (
            <div className="mt-12 rounded-lg border border-hairline bg-elevated p-4 text-sm text-foreground-secondary">
              Originally published at{" "}
              <a href={post.originalUrl} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                smfworks.com
              </a>
              .
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
