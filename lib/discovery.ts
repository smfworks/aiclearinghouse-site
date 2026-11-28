import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog/loader";
import { paginatePosts } from "@/lib/blog/pagination";
import { getAllSeries, SERIES_LABELS, type BlogPost, type BlogSeries } from "@/lib/blog/types";
import { absoluteUrl, ORG_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "@/lib/site";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type SitemapEntry = MetadataRoute.Sitemap[number];

function asDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const raw = value instanceof Date ? value.toISOString() : String(value);
  const day = raw.match(/\d{4}-\d{2}-\d{2}/);
  if (!day) return undefined;
  const date = new Date(`${day[0]}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function entry(
  path: string,
  opts: { lastModified?: Date; changeFrequency?: ChangeFrequency; priority?: number } = {}
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    ...(opts.lastModified ? { lastModified: opts.lastModified } : {}),
    ...(opts.changeFrequency ? { changeFrequency: opts.changeFrequency } : {}),
    ...(opts.priority !== undefined ? { priority: opts.priority } : {}),
  };
}

// 2026-11-28 site trim: the site is now home + blog only. The directory
// sections (agents, llms, guides, lab, reference, ...) were retired; see
// branch archive/full-directory-2026-11-28 if they are ever needed again.
export function buildSitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts();
  const latestPost = asDate(posts[0]?.date);
  const postsBySeries = new Map<BlogSeries, BlogPost[]>();
  for (const series of getAllSeries()) postsBySeries.set(series, []);
  for (const post of posts) {
    const bucket = postsBySeries.get(post.series);
    if (bucket) bucket.push(post);
  }

  const urls = new Map<string, SitemapEntry>();
  const add = (item: SitemapEntry) => {
    const prev = urls.get(item.url);
    if (!prev) {
      urls.set(item.url, item);
      return;
    }
    if (!prev.lastModified && item.lastModified) {
      urls.set(item.url, { ...prev, lastModified: item.lastModified });
    }
  };

  add(entry("/", { lastModified: latestPost, changeFrequency: "daily", priority: 1 }));
  add(entry("/blog", { lastModified: latestPost, changeFrequency: "daily", priority: 0.9 }));

  for (const post of posts) {
    add(
      entry(`/blog/${post.slug}`, {
        lastModified: asDate(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );
  }

  const addPages = (basePath: string, seriesPosts: BlogPost[]) => {
    const { totalPages } = paginatePosts(seriesPosts, 1);
    for (let page = 2; page <= totalPages; page += 1) {
      const slice = paginatePosts(seriesPosts, page);
      add(
        entry(`${basePath}/page/${page}`, {
          lastModified: asDate(slice.posts[0]?.date),
          changeFrequency: "weekly",
          priority: 0.3,
        })
      );
    }
  };

  addPages("/blog", posts);
  for (const series of getAllSeries()) {
    const seriesPosts = postsBySeries.get(series) ?? [];
    add(
      entry(`/blog/series/${series}`, {
        lastModified: asDate(seriesPosts[0]?.date),
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );
    addPages(`/blog/series/${series}`, seriesPosts);
  }

  return Array.from(urls.values());
}

export function buildLlmsTxt(): string {
  const seriesLinks = getAllSeries()
    .map((series) => {
      const meta = SERIES_LABELS[series];
      return `- [${meta.label}](${absoluteUrl(`/blog/series/${series}`)}): ${meta.description}`;
    })
    .join("\n");

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION} Published by ${ORG_NAME}.

The Clearinghouse is the SMF Works field journal for AI agents: how-tos, release notes, and practitioner dispatches.

## Blog

- [The Clearinghouse Log](${absoluteUrl("/blog")}): Practitioner dispatches from the ${ORG_NAME} agent team
${seriesLinks}

## Optional

- [XML sitemap](${SITE_ORIGIN}/sitemap.xml): Public pages, including individual essays
- [Source](https://github.com/smfworks/aiclearinghouse-site): Site repository
`;
}
