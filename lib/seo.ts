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

function publisherOrganization() {
  return {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: ORG_NAME,
    url: "https://smfworks.com",
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE.url,
    },
  };
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
        publisher: publisherOrganization(),
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

const TITLE_MIN = 30;
const TITLE_MAX = 60;

/** Words that leave a title sounding cut off. Dropped from the end when the topic still fits. */
const TITLE_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "vs",
  "vs.",
  "for",
  "to",
  "of",
  "in",
  "on",
  "with",
  "from",
  "what",
  "your",
  "every",
  "must",
]);

function trimTitleEdge(text: string): string {
  let parts = text.replace(/[\s,;:–—-]+$/g, "").trim().split(" ");
  while (parts.length > 1) {
    const last = parts[parts.length - 1].replace(/[.,;:]+$/g, "").toLowerCase();
    const shorter = parts.slice(0, -1).join(" ");
    if (TITLE_STOP_WORDS.has(last) && shorter.length >= TITLE_MIN) {
      parts = parts.slice(0, -1);
      continue;
    }
    break;
  }
  return parts.join(" ").replace(/[\s,;:–—-]+$/g, "").trim();
}

/**
 * Document title: primary topic first, about 30–60 characters.
 * The on-page H1 keeps the full headline.
 */
export function fitPageTitle(topic: string): string {
  const cleaned = topic.replace(/\s+/g, " ").trim();
  if (cleaned.length >= TITLE_MIN && cleaned.length <= TITLE_MAX) return cleaned;

  if (cleaned.length < TITLE_MIN) {
    const branded = `${cleaned} | SMF Clearinghouse`;
    if (branded.length >= TITLE_MIN && branded.length <= TITLE_MAX) return branded;
    return cleaned;
  }

  const sep = ": ";
  const splitAt = cleaned.indexOf(sep);
  if (splitAt !== -1) {
    const primary = cleaned.slice(0, splitAt).trim();
    const tail = cleaned.slice(splitAt + sep.length).trim();
    if (primary.length >= TITLE_MIN && primary.length <= TITLE_MAX) return primary;
    if (primary.length < TITLE_MIN && tail) {
      const words = tail.split(/\s+/);
      let built = primary;
      let started = false;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const candidate = started ? `${built} ${word}` : `${primary}${sep}${word}`;
        if (candidate.length > TITLE_MAX) break;
        built = candidate;
        started = true;
        const token = word.replace(/[.,;:]+$/g, "").toLowerCase();
        const next = words[i + 1];
        const nextToken = next ? next.replace(/[.,;:]+$/g, "").toLowerCase() : "";
        const nextWouldExceed = next ? `${built} ${next}`.length > TITLE_MAX : true;
        if (
          built.length >= TITLE_MIN &&
          !TITLE_STOP_WORDS.has(token) &&
          (nextWouldExceed || TITLE_STOP_WORDS.has(nextToken) || built.length >= 50)
        ) {
          return trimTitleEdge(built);
        }
      }
      const trimmed = trimTitleEdge(built);
      if (trimmed.length >= TITLE_MIN && trimmed.length <= TITLE_MAX) return trimmed;
    }
  }

  const cutAt = cleaned.lastIndexOf(" ", TITLE_MAX);
  const sliced = cutAt >= TITLE_MIN ? cleaned.slice(0, cutAt) : cleaned.slice(0, TITLE_MAX);
  const trimmed = trimTitleEdge(sliced);
  if (trimmed.length >= TITLE_MIN && trimmed.length <= TITLE_MAX) return trimmed;
  return cleaned.slice(0, TITLE_MAX).trim();
}

/** ISO date from front matter. Quoted dates stay as written; YAML dates survive String(Date). */
export function isoDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/^"|"$/g, "");
  const iso = /^(\d{4}-\d{2}-\d{2})/.exec(trimmed);
  if (iso) return iso[1];
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return undefined;
}

/**
 * Pamela Flannery writes the directory. Named on /about. No employer is added here.
 */
export const GUIDE_AUTHOR_NAME = "Pamela Flannery";

export const GUIDE_SECTION_LABEL = "How-To Guides";

/** Drop the markdown H1 when the page template already renders that title. */
export function omitDuplicateTitleHeading(markdown: string, title: string): string {
  const normalizedTitle = title.replace(/\s+/g, " ").trim().toLowerCase();
  const lines = markdown.split("\n");
  let index = 0;
  while (index < lines.length && lines[index].trim() === "") index += 1;
  if (index >= lines.length) return markdown;
  const match = /^#\s+(.+?)\s*$/.exec(lines[index]);
  if (!match) return markdown;
  const heading = match[1].replace(/\s+/g, " ").trim().toLowerCase();
  if (heading !== normalizedTitle) return markdown;
  lines.splice(index, 1);
  if (lines[index] === "") lines.splice(index, 1);
  return lines.join("\n");
}

function plainAnswerText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Question headings that already have a direct prose answer underneath.
 * Lists, tables, and short prompts are left out. Nothing is written here.
 */
export function extractQuestionAnswers(markdown: string): FaqEntry[] {
  const lines = markdown.split("\n");
  const faqs: FaqEntry[] = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const heading = /^#{2,3}\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) continue;
    const question = heading[1].trim();
    if (!question.endsWith("?")) continue;

    let cursor = i + 1;
    while (cursor < lines.length && lines[cursor].trim() === "") cursor += 1;
    if (cursor >= lines.length) continue;

    const next = lines[cursor];
    if (
      /^#{1,6}\s/.test(next) ||
      /^[-*]\s/.test(next) ||
      /^\d+\.\s/.test(next) ||
      next.startsWith("|") ||
      next.startsWith(">") ||
      next.startsWith("```")
    ) {
      continue;
    }

    const paragraph: string[] = [];
    while (cursor < lines.length && lines[cursor].trim() !== "") {
      const current = lines[cursor];
      if (
        current.startsWith("```") ||
        /^#{1,6}\s/.test(current) ||
        /^[-*]\s/.test(current) ||
        /^\d+\.\s/.test(current) ||
        current.startsWith("|")
      ) {
        break;
      }
      paragraph.push(current);
      cursor += 1;
    }

    const answer = plainAnswerText(paragraph.join(" "));
    if (wordCount(answer) < 40) continue;
    faqs.push({ question, answer });
  }

  return faqs;
}

export interface GuideArticleSource {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  /** Verification or publication date from front matter. Omitted when absent. */
  date?: unknown;
  image?: string;
  authorName?: string;
}

/** BlogPosting + breadcrumbs for a guide. FAQPage is added only from visible answers. */
export function guideArticleJsonLd(guide: GuideArticleSource) {
  const pageUrl = absoluteUrl(`/guides/${guide.slug}`);
  const description = truncateMetaDescription(guide.excerpt);
  const published = isoDate(guide.date);
  const authorName = (guide.authorName || GUIDE_AUTHOR_NAME).trim();
  const image = guide.image?.trim();

  const posting: Record<string, unknown> = {
    "@type": "BlogPosting",
    headline: guide.title,
    description,
    author: {
      "@type": "Person",
      name: authorName,
      url: absoluteUrl("/about"),
    },
    publisher: publisherOrganization(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  if (image) posting.image = absolutePostImage(image);
  if (published) {
    posting.datePublished = published;
    posting.dateModified = published;
  }

  const graph: object[] = [
    posting,
    breadcrumbListJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: GUIDE_SECTION_LABEL, url: absoluteUrl("/guides") },
      { name: guide.title, url: pageUrl },
    ]),
  ];

  if (guide.content) {
    const faqs = extractQuestionAnswers(guide.content);
    if (faqs.length > 0) graph.push(faqPageNode(faqs));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
