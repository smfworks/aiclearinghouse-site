import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost, BlogSeries, getAuthorByKey, getAuthorByName, getSeriesLabel } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function inferSeries(authorName: string, categories: string[], slug: string): BlogSeries {
  if (categories.some((c) => /liam/i.test(c))) return "liam";
  if (categories.some((c) => /terminal/i.test(c))) return "terminal";
  if (categories.some((c) => /dr\.?j|diagnostic/i.test(c))) return "drj";
  if (categories.some((c) => /jeff|windows|microsoft/i.test(c))) return "jeff";

  const name = authorName.toLowerCase();
  if (name.includes("liam")) return "liam";
  if (name.includes("jeff")) return "jeff";
  if (name.includes("dr j") || name.includes("dr. j") || name.includes("doctor")) return "drj";

  // Terminal posts often have no author; infer from path via originalUrl or slug hints
  if (/terminal|openclaw-on-linux|cli|kimi.code|infrastructure/i.test(slug)) return "terminal";

  return "clearinghouse";
}

function parseFrontmatter(raw: string): Record<string, any> {
  const parsed = matter(raw);
  return { ...parsed.data, content: parsed.content };
}

function normalizeReadTime(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) return parseInt(match[0], 10);
  }
  return 0;
}

function normalizeDate(value: unknown): string {
  if (!value) return "";
  const str = String(value);
  // Already ISO or YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  // Try to parse
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return str;
}

function loadPost(slug: string): BlogPost | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const fm = parseFrontmatter(raw);

  const title = String(fm.title || "");
  const excerpt = String(fm.excerpt || "");
  const content = String(fm.content || "").trimStart();
  const date = normalizeDate(fm.date);
  const authorName = String(fm.author || "").trim();
  const categories = Array.isArray(fm.categories) ? fm.categories.map(String) : [];
  const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];
  const image = fm.image ? String(fm.image) : undefined;
  const readTime = normalizeReadTime(fm.readTime);
  const originalUrl = fm.original_url ? String(fm.original_url) : undefined;

  // Resolve author key
  let author = authorName;
  let authorKey = "";
  if (authorName) {
    const matched = getAuthorByName(authorName);
    if (matched) {
      author = matched.name;
      authorKey = matched.key;
    } else {
      authorKey = authorName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    }
  } else {
    // Default to series author if no author field
    const series = inferSeries("", categories, slug);
    const fallback = getAuthorByKey(series);
    if (fallback) {
      author = fallback.name;
      authorKey = fallback.key;
    }
  }

  const series = inferSeries(authorName, categories, slug);

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title,
    excerpt,
    content,
    date,
    author,
    authorKey,
    series,
    seriesLabel: getSeriesLabel(series),
    categories,
    tags,
    image,
    readTime: readTime || Math.max(1, Math.round(wordCount / 200)),
    wordCount,
    originalUrl,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  return files
    .map((slug) => loadPost(slug))
    .filter((p): p is BlogPost => p !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return loadPost(slug);
}

export function getBlogPostsBySeries(series: BlogSeries): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.series === series);
}

export function getBlogPostsByAuthor(authorKey: string): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.authorKey === authorKey.toLowerCase());
}

export function getBlogCategories(): string[] {
  const posts = getAllBlogPosts();
  const cats = new Set<string>();
  for (const post of posts) {
    for (const cat of post.categories) {
      cats.add(cat);
    }
  }
  return Array.from(cats).sort();
}

export function getBlogSeriesCounts(): Record<BlogSeries, number> {
  const posts = getAllBlogPosts();
  const counts: Partial<Record<BlogSeries, number>> = {};
  for (const post of posts) {
    counts[post.series] = (counts[post.series] || 0) + 1;
  }
  return counts as Record<BlogSeries, number>;
}
