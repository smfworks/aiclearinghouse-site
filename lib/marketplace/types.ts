export type AgentPricing = "Free" | "Paid" | "Freemium" | "Open Source";
export type AgentRuntime = "Local" | "Cloud" | "Hybrid";

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

export const sectionNames: Record<string, string> = {
  services: "Services",
  skills: "Skills & Addons",
  tips: "Tips & Tricks",
  tests: "Test Results",
  "self-hosting": "Self-Hosting",
  "use-cases": "Use Cases",
  alternatives: "Alternatives",
  "deployment-recipes": "Deployment Recipes",
  deals: "Vendor Deals",
  changelog: "Agent Changelog",
  safety: "AI Safety",
  "getting-started": "Getting Started",
  lab: "The Lab",
  guides: "How-To Guides",
};

export function getSectionTitle(section: string): string {
  return sectionNames[section] || section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
