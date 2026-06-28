export const agentNameColors: Record<string, string> = {
  openclaw: "#22d3ee",
  "claude-code": "#ff667f",
  cursor: "#a685ff",
  aider: "#00d294",
  cline: "#00d2ef",
  devin: "#fcbb00",
  "github-copilot": "#ff6568",
  "hermes-agent": "#f5a623",
  lovable: "#ec6cff",
  "microsoft-scout": "#54a2ff",
  "openai-codex": "#ff8b1a",
  openhands: "#9de500",
  "replit-agent": "#7d87ff",
  bolt: "#00d3bd",
  v0: "#ffffff",
  windsurf: "#fac800",
  zed: "#00d2ef",
  perplexity: "#e85d4e",
  chatgpt: "#10a37f",
  gemini: "#4285f4",
  letta: "#f59e0b",
  manus: "#f59e0b",
};

export function getAgentColor(id: string): string {
  return agentNameColors[id] || "#22d3ee";
}
