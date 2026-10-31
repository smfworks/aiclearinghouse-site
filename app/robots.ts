import type { MetadataRoute } from "next";
import { AI_SEARCH_BOTS, SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const allowPublic = { allow: "/", disallow: "/p/" };
  return {
    rules: [
      { userAgent: "*", ...allowPublic },
      { userAgent: [...AI_SEARCH_BOTS], ...allowPublic },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
