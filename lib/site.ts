export const SITE_ORIGIN = "https://www.smfclearinghouse.com";

export const SITE_NAME = "SMF Clearinghouse";

export const ORG_NAME = "SMF Works";

export const SITE_DESCRIPTION =
  "Compare autonomous AI agents, LLM pricing, open-source tools, vendor services, and tested self-hosting recipes.";

/** Default share image already used by the root layout. Absolute, per the Metadata API. */
export const DEFAULT_OG_IMAGE = {
  url: "https://smfclearinghouse.com/images/clearinghouse-og.png",
  width: 1200,
  height: 630,
  alt: "SMF Clearinghouse — AI tools directory",
} as const;

/**
 * Public profiles already cited on this site.
 * LinkedIn is omitted: the repo has no company or person LinkedIn URL.
 */
export const ORG_SAME_AS = [
  "https://github.com/smfworks",
  "https://github.com/smfworks/aiclearinghouse-site",
  "https://x.com/smfworks",
  "https://x.com/MichaelGannotti",
] as const;

/** Search and assistant crawlers. Allow rules only — never block these agents. */
export const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "DuckAssistBot",
] as const;

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_ORIGIN}/`;
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  const withTrailing = withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  return `${SITE_ORIGIN}${withTrailing}`;
}

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: ORG_NAME,
      url: "https://smfworks.com",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/images/clearinghouse-og.png`,
      },
      sameAs: [...ORG_SAME_AS],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      inLanguage: "en",
    },
  ],
};

export function siteJsonLdHtml(): string {
  return JSON.stringify(siteJsonLd).replace(/</g, "\\u003c");
}
