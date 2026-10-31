import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/discovery";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap();
}
