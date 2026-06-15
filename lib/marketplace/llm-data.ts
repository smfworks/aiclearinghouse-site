import { LLMPricingData, LLMProvider, LLMModel } from "./types";

const dataDir = process.cwd();

let _cached: LLMPricingData | null = null;

export function getLLMPricingData(): LLMPricingData {
  if (_cached) return _cached;
  const fs = require("fs");
  const path = require("path");
  const raw = fs.readFileSync(path.join(dataDir, "data", "llm-pricing.json"), "utf-8");
  _cached = JSON.parse(raw) as LLMPricingData;
  return _cached;
}

export function getLLMProviders(): LLMProvider[] {
  const data = getLLMPricingData();
  return data.providers || [];
}

export function getLLMProvider(id: string): LLMProvider | undefined {
  return getLLMProviders().find((p) => p.id === id);
}

export function getAllLLMModels(): (LLMModel & { providerId: string; providerName: string })[] {
  const providers = getLLMProviders();
  const models: (LLMModel & { providerId: string; providerName: string })[] = [];
  for (const p of providers) {
    for (const m of p.models) {
      models.push({ ...m, providerId: p.id, providerName: p.name });
    }
  }
  return models;
}

export function getLLMCategories(): string[] {
  const cats = new Set<string>();
  for (const m of getAllLLMModels()) {
    if (m.category) cats.add(m.category);
  }
  return Array.from(cats).sort();
}