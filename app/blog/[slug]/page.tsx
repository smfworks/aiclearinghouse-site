import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TwitterWidgetLoader from "@/components/TwitterWidgetLoader";
import JsonLd from "@/components/JsonLd";
import { getAllBlogPosts, getBlogCatalog, getBlogPostBySlug } from "@/lib/blog/loader";
import { getAuthorByKey, SERIES_LABELS } from "@/lib/blog/types";
import { blogPostJsonLd, selectRelatedPosts, truncateMetaDescription } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found | SMF Clearinghouse" };

  const description = truncateMetaDescription(post.excerpt);

  return {
    title: `${post.title} | SMF Clearinghouse`,
    description,
    alternates: { canonical: post.canonicalUrl },
    openGraph: {
      title: post.title,
      description,
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
      description,
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
  const related = selectRelatedPosts(post, getBlogCatalog());
  const html = await marked(post.content);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={blogPostJsonLd(post)} />
      <Nav />
      <main className="flex-1 bg-canvas">
        <article>
          <header className="bg-rd-masthead relative overflow-hidden border-b border-hairline">
            <div className="bg-rd-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="relative mx-auto max-w-3xl px-6 py-14 sm:py-16">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
                {series && (
                  <Link
                    href={`/blog/series/${post.series}/`}
                    className="inline-flex items-center rounded-full border border-accent/30 bg-accent/12 px-3 py-1 font-mono text-xs font-medium tracking-wide text-accent transition-colors hover:border-accent/60 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {series.label}
                  </Link>
                )}
                <time
                  className="font-mono text-xs uppercase tracking-[0.14em] text-foreground-tertiary"
                  dateTime={post.date}
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
                {post.readTime > 0 && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-foreground-tertiary">
                    <Clock className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
                    {post.readTime} min read
                  </span>
                )}
              </div>

              <h1 className="font-display text-balance text-3xl font-semibold leading-[1.15] tracking-[-0.025em] text-foreground sm:text-5xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-5 text-lg leading-relaxed text-foreground-secondary sm:text-[1.15rem]">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-8 flex items-center gap-3.5 border-t border-hairline/75 pt-6">
                {author && (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#050608] ring-2 ring-panel shadow-sm"
                    style={{ backgroundColor: author.color }}
                    aria-hidden="true"
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
            <div className="hairline-signal-subtle h-px w-full" aria-hidden="true" />
          </header>

          <div className="mx-auto max-w-3xl px-6 py-12 sm:py-14">
            {post.image && (
              <div className="mb-12 overflow-hidden rounded-2xl border border-hairline bg-panel shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full object-cover"
                  width={1200}
                  height={630}
                />
              </div>
            )}

            <TwitterWidgetLoader />
            <div
              className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-cyan hover:prose-a:text-accent"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {post.originalUrl && (
              <div className="card-rd mt-12 rounded-xl border border-hairline px-5 py-4 text-sm text-foreground-secondary">
                Originally published at{" "}
                <a
                  href={post.originalUrl}
                  className="font-medium text-accent hover:text-accent-hover hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  smfworks.com
                </a>
                .
              </div>
            )}

            <nav aria-label="More from the blog" className="mt-14 border-t border-hairline pt-10">
              {related.length > 0 && (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="h-px w-5 bg-accent" aria-hidden="true" />
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                      Related dispatches
                    </h2>
                  </div>
                  <ul className="mt-5 grid gap-3">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/blog/${item.slug}/`}
                          className="card-rd group flex items-center justify-between gap-4 rounded-xl border border-hairline px-5 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <span className="font-medium text-foreground transition-colors group-hover:text-accent-hover">
                            {item.title}
                          </span>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0 text-foreground-tertiary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <Link
                  href="/blog/"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-elevated/70 px-4 py-2 font-medium text-foreground-secondary transition-colors hover:border-accent/55 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span>Back to the blog</span>
                </Link>
                {series && (
                  <Link
                    href={`/blog/series/${post.series}/`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-elevated/70 px-4 py-2 font-medium text-accent transition-colors hover:border-accent/55 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span>More in {series.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </p>
            </nav>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
