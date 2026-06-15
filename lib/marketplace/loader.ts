import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

function loadItem(section: string, slug: string): MarketplaceItem | undefined {
  const filePath = path.join(contentDir, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);

  return {
    slug: parsed.data.slug || slug,
    title: parsed.data.title || "",
    excerpt: parsed.data.excerpt || "",
    category: parsed.data.category || parsed.data.section || "General",
    tags: parsed.data.tags || [],
    image: parsed.data.image,
    ...parsed.data,
    content: parsed.content.trimStart(),
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

function toAgentProfile(item: MarketplaceItem): AgentProfile {
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
  return getAllItems("agents").map(toAgentProfile);
}

export function getAgentBySlug(slug: string): AgentProfile | null {
  const item = getItemBySlug("agents", slug);
  if (!item) return null;
  return toAgentProfile(item);
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
