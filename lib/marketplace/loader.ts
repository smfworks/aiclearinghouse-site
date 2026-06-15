import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  AgentPricing,
  AgentProfile,
  AgentRuntime,
  MarketplaceItem,
} from "./types";

const contentDir = path.join(process.cwd(), "content");

export function getSections(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith(".") && d.name !== "agentmarketplace")
    .map((d) => d.name)
    .sort();
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

  return item;
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
export type { AgentProfile, AgentPricing, AgentRuntime, MarketplaceItem } from "./types";
