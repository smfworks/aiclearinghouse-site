"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface SubmitAgentFormProps {
  issueUrl?: string;
}

export default function SubmitAgentForm({ issueUrl }: SubmitAgentFormProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueUrl) return;
    const title = encodeURIComponent(`Agent submission: ${name || "Unknown agent"}`);
    const body = encodeURIComponent(
      `## Agent Submission\n\n**Name:** ${name}\n**Website:** ${website || "N/A"}\n\n**Description:**\n${description || "No description provided."}\n\n---\n*Submitted via smfclearinghouse.com/agents*`
    );
    window.open(`${issueUrl}?title=${title}&body=${body}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-success-muted p-6 text-center">
        <p className="font-medium text-success">github issue form opened. Thanks for helping expand the directory!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-hairline bg-panel p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="agent-name" className="text-sm font-medium text-foreground">
            Agent name
          </label>
          <input
            id="agent-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
            placeholder="e.g. MyAgent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="agent-website" className="text-sm font-medium text-foreground">
            Website / repo URL
          </label>
          <input
            id="agent-website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label htmlFor="agent-description" className="text-sm font-medium text-foreground">
          What does it do?
        </label>
        <textarea
          id="agent-description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
          placeholder="Brief description, target use cases, pricing, and what makes it stand out..."
        />
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        Suggest Agent
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
