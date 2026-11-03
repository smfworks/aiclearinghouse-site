import { getAllBlogPosts } from "./blog/loader";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "./site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(day: string): string {
  const parsed = /^\d{4}-\d{2}-\d{2}/.test(day) ? new Date(`${day.slice(0, 10)}T00:00:00Z`) : new Date(day);
  if (Number.isNaN(parsed.getTime())) return new Date(0).toUTCString();
  return parsed.toUTCString();
}

export function buildRssFeed(): string {
  const items = getAllBlogPosts()
    .map((post) => {
      const link = absoluteUrl(`/blog/${post.slug}`);
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${escapeXml(pubDate(post.date))}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${escapeXml(`${SITE_ORIGIN}/`)}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>en-us</language>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
