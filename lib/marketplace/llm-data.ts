import fs from "fs";
import path from "path";
import { LLMPricingData } from "./pricing";

const dataPath = path.join(process.cwd(), "data", "llm-pricing.json");

export function getLLMPricingData(): LLMPricingData {
  if (!fs.existsSync(dataPath)) {
    return { generated_at: "", updated_at: "", source: "missing", models: [] };
  }
  return JSON.parse(fs.readFileSync(dataPath, "utf-8")) as LLMPricingData;
}
