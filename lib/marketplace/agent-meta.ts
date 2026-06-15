export interface AgentMeta {
  id: string;
  useCases: string[];
  supportedEditors: string[];
  supportedProviders: string[];
  operatingSystems: string[];
  deploymentType: "local" | "cloud" | "hybrid";
  setupComplexity: "low" | "medium" | "high";
  humanInTheLoop: boolean;
  sandboxed: boolean;
  auditLogging: boolean;
  mcpSupport: boolean;
  alternativesTo?: string[];
  deals?: { text: string; url: string; expires?: string }[];
  changelogUrl?: string;
  deploymentRecipes?: string[];
}

export function getAgentMeta(id: string): AgentMeta | undefined {
  return undefined;
}
