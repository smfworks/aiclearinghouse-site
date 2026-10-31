import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog/loader";
import { paginatePosts } from "@/lib/blog/pagination";
import { getAllSeries, SERIES_LABELS, type BlogPost, type BlogSeries } from "@/lib/blog/types";
import { getAllItems } from "@/lib/marketplace/loader";
import { getLLMPricingData, getLLMProviders } from "@/lib/marketplace/llm-data";
import type { MarketplaceItem } from "@/lib/marketplace/types";
import { absoluteUrl, ORG_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "@/lib/site";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Sections that have both an index route and /[section]/[slug] pages. */
const INDEXED_SECTIONS = [
  "alternatives",
  "changelog",
  "deals",
  "deployment-recipes",
  "getting-started",
  "guides",
  "reviews",
  "safety",
  "self-hosting",
  "services",
  "skills",
  "tests",
  "tips",
  "use-cases",
] as const;

const REFERENCE_SECTIONS = [
  "guides",
  "deployment-recipes",
  "reviews",
  "skills",
  "tips",
  "ai-news",
] as const;

function asDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const raw = value instanceof Date ? value.toISOString() : String(value);
  const day = raw.match(/\d{4}-\d{2}-\d{2}/);
  if (!day) return undefined;
  const date = new Date(`${day[0]}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function latest(dates: Array<Date | undefined>): Date | undefined {
  let max: Date | undefined;
  for (const date of dates) {
    if (!date) continue;
    if (!max || date > max) max = date;
  }
  return max;
}

function itemLastMod(item: MarketplaceItem): Date | undefined {
  return (
    asDate(item.date) ||
    asDate(item.published_at) ||
    asDate(item.last_updated) ||
    asDate(item.last_verified) ||
    asDate(item.updated_at)
  );
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

export function buildSitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts();
  const latestPost = asDate(posts[0]?.date);
  const postsBySeries = new Map<BlogSeries, BlogPost[]>();
  for (const series of getAllSeries()) postsBySeries.set(series, []);
  for (const post of posts) {
    const bucket = postsBySeries.get(post.series);
    if (bucket) bucket.push(post);
  }

  const sectionItems = new Map<string, MarketplaceItem[]>();
  const loadSection = (section: string) => {
    if (!sectionItems.has(section)) sectionItems.set(section, getAllItems(section));
    return sectionItems.get(section)!;
  };

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

  const referenceLastMod = latest(
    REFERENCE_SECTIONS.flatMap((section) => loadSection(section).map(itemLastMod))
  );
  const labItems = loadSection("lab");
  const newsItems = loadSection("ai-news");
  const pricingUpdated = asDate(getLLMPricingData().updated_at);

  add(entry("/", { lastModified: latestPost, changeFrequency: "daily", priority: 1 }));
  add(entry("/blog", { lastModified: latestPost, changeFrequency: "daily", priority: 0.9 }));
  add(
    entry("/lab", {
      lastModified: latest(labItems.map(itemLastMod)),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );
  add(entry("/reference", { lastModified: referenceLastMod, changeFrequency: "weekly", priority: 0.9 }));
  add(entry("/about", { changeFrequency: "monthly", priority: 0.6 }));
  add(entry("/what-is-the-clearinghouse", { changeFrequency: "monthly", priority: 0.7 }));
  add(entry("/agents", { changeFrequency: "weekly", priority: 0.8 }));
  add(entry("/agents/compare", { changeFrequency: "weekly", priority: 0.6 }));
  add(entry("/llms", { lastModified: pricingUpdated, changeFrequency: "weekly", priority: 0.8 }));
  add(entry("/llms/compare", { lastModified: pricingUpdated, changeFrequency: "weekly", priority: 0.6 }));
  add(entry("/whitepapers", { changeFrequency: "monthly", priority: 0.5 }));
  add(
    entry("/ai-news", {
      lastModified: latest(newsItems.map(itemLastMod)),
      changeFrequency: "daily",
      priority: 0.7,
    })
  );

  for (const section of INDEXED_SECTIONS) {
    const items = loadSection(section);
    add(
      entry(`/${section}`, {
        lastModified: latest(items.map(itemLastMod)),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
    for (const item of items) {
      add(
        entry(`/${section}/${item.slug}`, {
          lastModified: itemLastMod(item),
          changeFrequency: "monthly",
          priority: 0.5,
        })
      );
    }
  }

  for (const item of labItems) {
    add(
      entry(`/lab/${item.slug}`, {
        lastModified: itemLastMod(item),
        changeFrequency: "monthly",
        priority: 0.5,
      })
    );
  }

  for (const item of loadSection("methodology")) {
    add(
      entry(`/methodology/${item.slug}`, {
        lastModified: itemLastMod(item),
        changeFrequency: "monthly",
        priority: 0.5,
      })
    );
  }

  for (const agent of loadSection("agents")) {
    add(
      entry(`/agents/${agent.slug}`, {
        lastModified: itemLastMod(agent),
        changeFrequency: "monthly",
        priority: 0.5,
      })
    );
  }

  for (const provider of getLLMProviders()) {
    add(
      entry(`/llms/${provider.id}`, {
        lastModified: pricingUpdated,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  }

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

  const methodologyLinks = getAllItems("methodology")
    .map((item) => `- [${item.title}](${absoluteUrl(`/methodology/${item.slug}`)}): ${item.excerpt}`)
    .join("\n");

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION} Published by ${ORG_NAME}.

The Clearinghouse is an independent directory for builders. Blog is the essay feed. Lab is work you can inspect. Reference is the shelf of guides, recipes, reviews, and notes.

## Clearinghouse

- [Home](${absoluteUrl("/")}): Directory of agents, models, services, and recipes
- [What is the Clearinghouse](${absoluteUrl("/what-is-the-clearinghouse")}): How the directory is organized
- [About](${absoluteUrl("/about")}): What ${SITE_NAME} covers and how entries are curated
- [Agents](${absoluteUrl("/agents")}): Compare autonomous AI agents by category, runtime, and pricing
- [Compare agents](${absoluteUrl("/agents/compare")}): Side-by-side agent comparison
- [LLM pricing](${absoluteUrl("/llms")}): Model prices, context windows, and benchmark scores
- [Compare models](${absoluteUrl("/llms/compare")}): Side-by-side model comparison
- [Services](${absoluteUrl("/services")}): Hosting, security, data, observability, and GPU clouds
- [Skills and add-ons](${absoluteUrl("/skills")}): Reusable skills, MCP servers, plugins, and extensions
- [Use cases](${absoluteUrl("/use-cases")}): Agents for code review, UI, debugging, research, and security
- [Alternatives](${absoluteUrl("/alternatives")}): Replacements for common AI tools
- [Getting started](${absoluteUrl("/getting-started")}): A path from a first agent to local self-hosting
- [Self-hosting](${absoluteUrl("/self-hosting")}): Hardware and OS guides for local agents and models
- [Safety](${absoluteUrl("/safety")}): Permissions, prompt injection, and operational checklists
- [Deals](${absoluteUrl("/deals")}): Credits, startup programs, and free tiers
- [Changelog](${absoluteUrl("/changelog")}): Recent releases from major agents
- [AI news](${absoluteUrl("/ai-news")}): Filed reporting, separate from the essay feed

## Blog

- [The Clearinghouse Log](${absoluteUrl("/blog")}): Practitioner dispatches from the ${ORG_NAME} agent team
${seriesLinks}

## Lab

- [Lab](${absoluteUrl("/lab")}): Tests, benchmarks, agents, and models you can inspect
- [Tests](${absoluteUrl("/tests")}): Benchmark reports and what was actually run
${methodologyLinks}

## Reference

- [Reference](${absoluteUrl("/reference")}): Guides, recipes, reviews, skills, and filed notes
- [Guides](${absoluteUrl("/guides")}): Longer how-to paths
- [Deployment recipes](${absoluteUrl("/deployment-recipes")}): Copy-paste setups
- [Reviews](${absoluteUrl("/reviews")}): Hands-on reviews with the limits named
- [Tips](${absoluteUrl("/tips")}): Short notes a builder can use
- [White papers](${absoluteUrl("/whitepapers")}): Longer research papers

## Optional

- [XML sitemap](${SITE_ORIGIN}/sitemap.xml): Public pages, including individual essays and directory entries
- [Source](https://github.com/smfworks/aiclearinghouse-site): Site repository
`;
}
