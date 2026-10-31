import { DEFAULT_OG_IMAGE, ORG_NAME, SITE_ORIGIN, absoluteUrl } from "./site";

const META_DESCRIPTION_MAX = 160;

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Collapse whitespace and keep meta descriptions within the usual snippet length. */
export function truncateMetaDescription(text: string, max = META_DESCRIPTION_MAX): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const window = cleaned.slice(0, max - 1);
  const lastSpace = window.lastIndexOf(" ");
  const base = (lastSpace > 40 ? window.slice(0, lastSpace) : window).trimEnd();
  return `${base}…`;
}

export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function jsonLdDocument(data: object | object[]) {
  if (Array.isArray(data)) {
    return {
      "@context": "https://schema.org",
      "@graph": data,
    };
  }
  return {
    "@context": "https://schema.org",
    ...data,
  };
}

export function breadcrumbListJsonLd(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqPageNode(faqs: readonly FaqEntry[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface RelatedCandidate {
  slug: string;
  series: string;
  tags: string[];
  date: string;
}

/** Prefer the same series, then shared tags. At most four. Unrelated posts are left out. */
export function selectRelatedPosts<T extends RelatedCandidate>(
  current: T,
  posts: readonly T[],
  limit = 4,
): T[] {
  const tags = new Set(current.tags.map((tag) => tag.toLowerCase()));
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const shared = post.tags.reduce(
        (count, tag) => count + (tags.has(tag.toLowerCase()) ? 1 : 0),
        0,
      );
      const sameSeries = post.series === current.series ? 1 : 0;
      return { post, score: sameSeries * 10 + shared };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.date.localeCompare(a.post.date);
    })
    .slice(0, limit)
    .map((entry) => entry.post);
}

export interface BlogPostingSource {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  canonicalUrl?: string;
}

function absolutePostImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE.url;
  if (/^https?:\/\//i.test(image)) return image;
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${SITE_ORIGIN}${path}`;
}

/** Match next.config trailingSlash so schema URLs agree with the canonical link. */
function withTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

export function blogPostJsonLd(post: BlogPostingSource) {
  const pageUrl = withTrailingSlash(post.canonicalUrl?.trim() || absoluteUrl(`/blog/${post.slug}`));
  const description = truncateMetaDescription(post.excerpt);
  const published = post.date.trim();
  const authorName = post.author.trim() || ORG_NAME;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description,
        image: absolutePostImage(post.image),
        author: {
          "@type": "Person",
          name: authorName,
          url: absoluteUrl("/about"),
        },
        ...(published ? { datePublished: published, dateModified: published } : {}),
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`,
          name: ORG_NAME,
          url: "https://smfworks.com",
          logo: {
            "@type": "ImageObject",
            url: DEFAULT_OG_IMAGE.url,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
      },
      breadcrumbListJsonLd([
        { name: "Home", url: absoluteUrl("/") },
        { name: "Blog", url: absoluteUrl("/blog") },
        { name: post.title, url: pageUrl },
      ]),
    ],
  };
}
