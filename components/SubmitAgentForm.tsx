"use client";

import { useState } from "react";

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
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <p className="font-semibold text-emerald-600 dark:text-emerald-400">GitHub issue form opened. Thanks for helping expand the directory!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="agent-name" className="text-sm font-semibold text-foreground">Agent name</label>
          <input
            id="agent-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
            placeholder="e.g. MyAgent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="agent-website" className="text-sm font-semibold text-foreground">Website / repo URL</label>
          <input
            id="agent-website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label htmlFor="agent-description" className="text-sm font-semibold text-foreground">What does it do?</label>
        <textarea
          id="agent-description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
          placeholder="Brief description, target use cases, pricing, and what makes it stand out..."
        />
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Suggest Agent
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </form>
  );
}
