export type AgentPricing = "Free" | "Paid" | "Freemium" | "Open Source";
export type AgentRuntime = "Local" | "Cloud" | "Hybrid";

export interface TestResult {
  agent: string;
  score?: number;
  time_minutes?: number;
  tokens?: number;
  cost_usd?: number;
  pass?: boolean;
  notes?: string;
}

export interface MarketplaceItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  image?: string;
  content: string;
  wordCount?: number;
  readingTime?: number;
  difficulty?: string;
  estimated_time?: string;
  agents?: string[];
  llm?: string;
  winner?: string;
  date?: string;
  results?: TestResult[];
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
  crossLinks?: { label: string; url: string }[];
}

export interface LLMModel {
  model: string;
  model_id: string;
  input_price: number | null;
  output_price: number | null;
  cached_input_price?: number | null;
  context_window: number | null;
  max_output_tokens?: number | null;
  mmlu?: number;
  humaneval?: number;
  chatbot_arena?: number;
  category?: string;
  description?: string;
  release_date?: string;
}

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  website: string;
  pricing_url: string;
  icon: string;
  type: "provider" | "platform";
  models: LLMModel[];
}

export interface LLMPricingData {
  generated_at: string;
  updated_at: string;
  source: string;
  providers: LLMProvider[];
  models: LLMModel[];
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
  reviews: "SMF Reviews",
};

export function getSectionTitle(section: string): string {
  return sectionNames[section] || section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}