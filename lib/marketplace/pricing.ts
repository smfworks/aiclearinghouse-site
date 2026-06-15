export interface LLMModel {
  provider: string;
  model: string;
  model_id: string;
  input_price: number;
  output_price: number;
  cached_input_price?: number | null;
  context_window: number;
  max_output_tokens?: number;
  mmlu?: number;
  humaneval?: number;
  chatbot_arena?: number;
  notes: string;
  source_url: string;
}

export interface LLMPricingData {
  generated_at: string;
  updated_at: string;
  source: string;
  models: LLMModel[];
}

export function getProviders(models: LLMModel[]): string[] {
  return Array.from(new Set(models.map((m) => m.provider))).sort();
}
