import fs from "fs";
import path from "path";

export interface MarketplaceItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  image?: string;
  content: string;
  [key: string]: any;
}

const contentDir = path.join(process.cwd(), "content");

function parseFrontmatter(raw: string): Record<string, string | number | boolean | string[]> {
  const lines = raw.split("\n");
  let inFm = false;
  let fmContent = "";

  for (const line of lines) {
    if (line.trim() === "---") {
      if (!inFm) {
        inFm = true;
        continue;
      } else {
        break;
      }
    }
    if (inFm) fmContent += line + "\n";
  }

  const trimmed = fmContent.trim();
  if (!trimmed) return {};

  if (trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return {};
    }
  }

  const result: Record<string, string | number | boolean | string[]> = {};
  let arrayBuffer: { key: string; value: string } | null = null;

  for (const line of fmContent.split("\n")) {
    const t = line.trimEnd();
    if (!t || t.startsWith("#")) continue;

    if (arrayBuffer) {
      const val = t.replace(/^-\s*/, "").trim();
      if (val) {
        const current = (result[arrayBuffer.key] as string[]) || [];
        current.push(stripQuotes(val));
        result[arrayBuffer.key] = current;
      }
      if (!line.startsWith(" ") && !line.startsWith("-")) {
        arrayBuffer = null;
      }
      continue;
    }

    const colonIndex = t.indexOf(":");
    if (colonIndex === -1) continue;
    const key = t.slice(0, colonIndex).trim();
    let value = t.slice(colonIndex + 1).trim();

    if (value === "") {
      arrayBuffer = { key, value: "" };
      result[key] = [];
      continue;
    }

    result[key] = parseValue(value);
  }

  return result;
}

function stripQuotes(v: string): string {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseValue(value: string): string | number | boolean | string[] {
  value = value.trim();
  const unquoted = stripQuotes(value);

  if (unquoted.startsWith("[") && unquoted.endsWith("]")) {
    return unquoted
      .slice(1, -1)
      .split(",")
      .map((s) => stripQuotes(s.trim()))
      .filter(Boolean);
  }

  if (unquoted === "true") return true;
  if (unquoted === "false") return false;

  if (!isNaN(Number(unquoted)) && unquoted !== "" && !unquoted.includes(" ")) {
    return Number(unquoted);
  }

  return unquoted;
}

function loadItem(section: string, slug: string): MarketplaceItem | undefined {
  const filePath = path.join(contentDir, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return undefined;

  const fm = parseFrontmatter(match[1]);
  const content = match[2].trimStart();

  return {
    slug: String(fm.slug || slug),
    title: String(fm.title || ""),
    excerpt: String(fm.excerpt || ""),
    category: String(fm.category || "General"),
    tags: (fm.tags as string[]) || [],
    image: fm.image ? String(fm.image) : undefined,
    ...fm,
    content,
  };
}

export function getAllItems(section: string): MarketplaceItem[] {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => loadItem(section, file.replace(/\.md$/, "")))
    .filter((p): p is MarketplaceItem => p !== undefined)
    .sort((a, b) => {
      if (typeof a.order === "number" && typeof b.order === "number") return a.order - b.order;
      if (a.date && b.date) return new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime();
      return a.title.localeCompare(b.title);
    });
}

export function getCategories(section: string): string[] {
  const items = getAllItems(section);
  return Array.from(new Set(items.map((i) => i.category))).sort();
}

export function getItemBySlug(section: string, slug: string): MarketplaceItem | null {
  return loadItem(section, slug) || null;
}

export type AgentPricing = "Free" | "Paid" | "Freemium" | "Open Source";
export type AgentRuntime = "Local" | "Cloud" | "Hybrid";

export interface AgentProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website: string;
  repository?: string;
  logo?: string;
  categories: string[];
  pricing: AgentPricing;
  runtime: AgentRuntime;
  openSource: boolean;
  multiPlatform: boolean;
  providerAgnostic: boolean;
  model?: string;
  platforms: string[];
  features: string[];
  releaseYear: number;
  company: string;
  lastVerified?: string;
}

export function getAllAgents(): AgentProfile[] {
  return getAllItems("agents").map((item) => ({
    id: item.slug,
    name: item.title,
    tagline: item.excerpt,
    description: item.content,
    website: String(item.website || ""),
    repository: item.repository ? String(item.repository) : undefined,
    logo: item.image ? String(item.image) : undefined,
    categories: (item.categories as string[]) || (item.tags as string[]) || [],
    pricing: (item.pricing as AgentPricing) || "Freemium",
    runtime: (item.runtime as AgentRuntime) || "Cloud",
    openSource: Boolean(item.openSource),
    multiPlatform: Boolean(item.multiPlatform),
    providerAgnostic: Boolean(item.providerAgnostic),
    model: item.model ? String(item.model) : undefined,
    platforms: (item.platforms as string[]) || [],
    features: (item.features as string[]) || [],
    releaseYear: typeof item.releaseYear === "number" ? item.releaseYear : new Date().getFullYear(),
    company: String(item.company || ""),
    lastVerified: item.last_verified ? String(item.last_verified) : undefined,
  }));
}

export function getAgentBySlug(slug: string): AgentProfile | null {
  const item = getItemBySlug("agents", slug);
  if (!item) return null;
  return {
    id: item.slug,
    name: item.title,
    tagline: item.excerpt,
    description: item.content,
    website: String(item.website || ""),
    repository: item.repository ? String(item.repository) : undefined,
    logo: item.image ? String(item.image) : undefined,
    categories: (item.categories as string[]) || (item.tags as string[]) || [],
    pricing: (item.pricing as AgentPricing) || "Freemium",
    runtime: (item.runtime as AgentRuntime) || "Cloud",
    openSource: Boolean(item.openSource),
    multiPlatform: Boolean(item.multiPlatform),
    providerAgnostic: Boolean(item.providerAgnostic),
    model: item.model ? String(item.model) : undefined,
    platforms: (item.platforms as string[]) || [],
    features: (item.features as string[]) || [],
    releaseYear: typeof item.releaseYear === "number" ? item.releaseYear : new Date().getFullYear(),
    company: String(item.company || ""),
    lastVerified: item.last_verified ? String(item.last_verified) : undefined,
  };
}

export function getAgentCategories(): string[] {
  return Array.from(new Set(getAllAgents().flatMap((a) => a.categories))).sort();
}

export function getAgentRuntimes(): AgentRuntime[] {
  return ["Local", "Cloud", "Hybrid"];
}

export function getAgentPricings(): AgentPricing[] {
  return ["Free", "Paid", "Freemium", "Open Source"];
}

export function getAgentPlatforms(): string[] {
  return Array.from(new Set(getAllAgents().flatMap((a) => a.platforms))).sort();
}
