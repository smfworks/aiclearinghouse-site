import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  AgentListItem,
  AgentPricing,
  AgentProfile,
  AgentRuntime,
  MarketplaceCard,
  MarketplaceItem,
} from "./types";

const contentDir = path.join(process.cwd(), "content");

export function getSections(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith(".") && d.name !== "agentmarketplace")
    .map((d) => d.name)
    .sort((a, b) => {
      // ai-news should appear early in UI but doesn't need to be first here
      return a.localeCompare(b);
    });
}

function loadItem(section: string, slug: string): MarketplaceItem | undefined {
  const filePath = path.join(contentDir, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);

  const wordCount = parsed.content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const item: MarketplaceItem = {
    slug: String(parsed.data.slug || slug),
    title: String(parsed.data.title || ""),
    excerpt: String(parsed.data.excerpt || ""),
    category: String(parsed.data.category || parsed.data.section || "General"),
    tags: normalizeArray(parsed.data.tags),
    image: parsed.data.image ? String(parsed.data.image) : undefined,
    ...parsed.data,
    content: parsed.content.trimStart(),
    wordCount,
    readingTime,
  };

  if (parsed.data.last_verified) {
    item.last_verified = String(parsed.data.last_verified);
  }
  if (parsed.data.published_at) {
    item.published_at = String(parsed.data.published_at);
  }
  if (parsed.data.url) {
    item.url = String(parsed.data.url);
  }

  return item;
}

function asText(value: unknown, mode: "date" | "instant" = "date"): string | undefined {
  if (value == null || value === "") return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return mode === "instant" ? value.toISOString() : value.toISOString().slice(0, 10);
  }
  const text = String(value).trim();
  return text || undefined;
}

/** Card fields for list pages and the homepage. The markdown body stays on the detail page. */
export function toMarketplaceCard(item: MarketplaceItem): MarketplaceCard {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    date: asText(item.date),
    tags: item.tags ?? [],
    image: item.image,
    category: item.category,
    last_verified: asText(item.last_verified),
    published_at: asText(item.published_at, "instant"),
    url: asText(item.url),
    source: typeof item.source === "string" ? item.source : undefined,
    readingTime: item.readingTime,
    wordCount: item.wordCount,
    difficulty: asText(item.difficulty),
    estimated_time: asText(item.estimated_time),
    rating: typeof item.rating === "number" ? item.rating : undefined,
    pricing_model: asText(item.pricing_model),
    pricing: asText(item.pricing),
    winner: asText(item.winner),
    agents: Array.isArray(item.agents) ? item.agents.map(String) : undefined,
    resultCount: Array.isArray(item.results) ? item.results.length : undefined,
    order: typeof item.order === "number" ? item.order : undefined,
  };
}

export function getAllCards(section: string): MarketplaceCard[] {
  return getAllItems(section).map(toMarketplaceCard);
}

export function getAllItems(section: string): MarketplaceItem[] {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => loadItem(section, file.replace(/\.md$/, "")))
    .filter((p): p is MarketplaceItem => p !== undefined)
    .sort((a, b) => {
      // Newest first: sort by last_verified date descending, then by date, then by order
      const dateA = a.last_verified || a.date || a.published_at;
      const dateB = b.last_verified || b.date || b.published_at;
      if (dateA && dateB) {
        const cmp = new Date(String(dateB)).getTime() - new Date(String(dateA)).getTime();
        if (cmp !== 0) return cmp;
      }
      if (typeof a.order === "number" && typeof b.order === "number") return a.order - b.order;
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

function normalizeArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function normalizePricing(value: unknown): AgentPricing {
  const allowed: AgentPricing[] = ["Free", "Paid", "Freemium", "Open Source"];
  const str = String(value || "").trim() as AgentPricing;
  return allowed.includes(str) ? str : "Freemium";
}

function normalizeRuntime(value: unknown): AgentRuntime {
  const allowed: AgentRuntime[] = ["Local", "Cloud", "Hybrid"];
  const str = String(value || "").trim() as AgentRuntime;
  return allowed.includes(str) ? str : "Cloud";
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
    categories: normalizeArray(item.categories || item.tags),
    pricing: normalizePricing(item.pricing),
    runtime: normalizeRuntime(item.runtime),
    openSource: Boolean(item.openSource),
    multiPlatform: Boolean(item.multiPlatform),
    providerAgnostic: Boolean(item.providerAgnostic),
    model: item.model ? String(item.model) : undefined,
    platforms: normalizeArray(item.platforms),
    features: normalizeArray(item.features),
    releaseYear: typeof item.releaseYear === "number" ? item.releaseYear : new Date().getFullYear(),
    company: String(item.company || ""),
    lastVerified: item.last_verified ? String(item.last_verified) : undefined,
  }));
}

export function toAgentListItem(agent: AgentProfile): AgentListItem {
  return {
    id: agent.id,
    name: agent.name,
    tagline: agent.tagline,
    website: agent.website,
    repository: agent.repository,
    logo: agent.logo,
    categories: agent.categories,
    pricing: agent.pricing,
    runtime: agent.runtime,
    openSource: agent.openSource,
    multiPlatform: agent.multiPlatform,
    providerAgnostic: agent.providerAgnostic,
    model: agent.model,
    platforms: agent.platforms,
    features: agent.features,
    releaseYear: agent.releaseYear,
    company: agent.company,
    lastVerified: agent.lastVerified,
    crossLinks: agent.crossLinks,
  };
}

export function getAgentList(): AgentListItem[] {
  return getAllAgents().map(toAgentListItem);
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
    categories: normalizeArray(item.categories || item.tags),
    pricing: normalizePricing(item.pricing),
    runtime: normalizeRuntime(item.runtime),
    openSource: Boolean(item.openSource),
    multiPlatform: Boolean(item.multiPlatform),
    providerAgnostic: Boolean(item.providerAgnostic),
    model: item.model ? String(item.model) : undefined,
    platforms: normalizeArray(item.platforms),
    features: normalizeArray(item.features),
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

export { getSectionTitle, sectionNames } from "./types";
export type {
  AgentListItem,
  AgentProfile,
  AgentPricing,
  AgentRuntime,
  MarketplaceCard,
  MarketplaceItem,
} from "./types";
