export interface CrossLink {
  label: string;
  targetId: string;
  targetName: string;
}

export const agentCrossLinks: Record<string, CrossLink[]> = {
  cursor: [
    { label: "If you want open-source, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want terminal-only, try", targetId: "claude-code", targetName: "Claude Code" },
    { label: "If you want no-code, try", targetId: "lovable", targetName: "Lovable" },
    { label: "If you want a different IDE, try", targetId: "windsurf", targetName: "Windsurf" },
  ],
  "claude-code": [
    { label: "If you want an IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want open-source, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want Copilot, try", targetId: "github-copilot", targetName: "GitHub Copilot" },
  ],
  aider: [
    { label: "If you want an IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal with Claude, try", targetId: "claude-code", targetName: "Claude Code" },
    { label: "If you want no-code, try", targetId: "lovable", targetName: "Lovable" },
  ],
  "github-copilot": [
    { label: "If you want open-source, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want an AI-native IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-driven, try", targetId: "claude-code", targetName: "Claude Code" },
  ],
  openclaw: [
    { label: "If you want a different personal assistant, try", targetId: "hermes-agent", targetName: "Hermes Agent" },
    { label: "If you want terminal-first, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want IDE integration, try", targetId: "cursor", targetName: "Cursor" },
  ],
  "hermes-agent": [
    { label: "If you want privacy-first, try", targetId: "openclaw", targetName: "OpenClaw" },
    { label: "If you want IDE integration, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want memory-first, try", targetId: "letta", targetName: "Letta" },
  ],
  perplexity: [
    { label: "If you want a general chatbot, try", targetId: "chatgpt", targetName: "ChatGPT" },
    { label: "If you want Google ecosystem, try", targetId: "gemini", targetName: "Gemini" },
    { label: "If you want coding, try", targetId: "cursor", targetName: "Cursor" },
  ],
  chatgpt: [
    { label: "If you want cited research, try", targetId: "perplexity", targetName: "Perplexity" },
    { label: "If you want Google integration, try", targetId: "gemini", targetName: "Gemini" },
    { label: "If you want coding, try", targetId: "cursor", targetName: "Cursor" },
  ],
  gemini: [
    { label: "If you want general chat, try", targetId: "chatgpt", targetName: "ChatGPT" },
    { label: "If you want cited research, try", targetId: "perplexity", targetName: "Perplexity" },
    { label: "If you want coding, try", targetId: "cursor", targetName: "Cursor" },
  ],
  devin: [
    { label: "If you want IDE-based, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-based, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want open-source, try", targetId: "openhands", targetName: "OpenHands" },
  ],
  letta: [
    { label: "If you want a complete assistant, try", targetId: "hermes-agent", targetName: "Hermes Agent" },
    { label: "If you want privacy-first, try", targetId: "openclaw", targetName: "OpenClaw" },
    { label: "If you want IDE integration, try", targetId: "cursor", targetName: "Cursor" },
  ],
  bolt: [
    { label: "If you want an IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-first, try", targetId: "claude-code", targetName: "Claude Code" },
    { label: "If you want no-code design, try", targetId: "lovable", targetName: "Lovable" },
  ],
  cline: [
    { label: "If you want an AI-native IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-driven, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want open-source IDE, try", targetId: "zed", targetName: "Zed" },
  ],
  "microsoft-scout": [
    { label: "If you want privacy-first, try", targetId: "openclaw", targetName: "OpenClaw" },
    { label: "If you want IDE integration, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-first, try", targetId: "claude-code", targetName: "Claude Code" },
  ],
  "openai-codex": [
    { label: "If you want an IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want open-source, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want no-code, try", targetId: "lovable", targetName: "Lovable" },
  ],
  openhands: [
    { label: "If you want IDE-based, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-based, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want cloud-based, try", targetId: "devin", targetName: "Devin" },
  ],
  "replit-agent": [
    { label: "If you want an IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-first, try", targetId: "claude-code", targetName: "Claude Code" },
    { label: "If you want no-code, try", targetId: "lovable", targetName: "Lovable" },
  ],
  v0: [
    { label: "If you want an IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want full app builder, try", targetId: "bolt", targetName: "Bolt.new" },
    { label: "If you want no-code design, try", targetId: "lovable", targetName: "Lovable" },
  ],
  windsurf: [
    { label: "If you want open-source, try", targetId: "zed", targetName: "Zed" },
    { label: "If you want terminal-first, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want no-code, try", targetId: "lovable", targetName: "Lovable" },
  ],
  zed: [
    { label: "If you want open-source IDE, try", targetId: "windsurf", targetName: "Windsurf" },
    { label: "If you want terminal-first, try", targetId: "aider", targetName: "Aider" },
    { label: "If you want VS Code extension, try", targetId: "cline", targetName: "Cline" },
  ],
  lovable: [
    { label: "If you want full stack, try", targetId: "bolt", targetName: "Bolt.new" },
    { label: "If you want an IDE, try", targetId: "cursor", targetName: "Cursor" },
    { label: "If you want terminal-first, try", targetId: "claude-code", targetName: "Claude Code" },
  ],
};

export function getCrossLinks(agentId: string): CrossLink[] {
  return agentCrossLinks[agentId] || [];
}
