"use client";

import { Mail, ArrowRight } from "lucide-react";

interface SuggestAgentCTAProps {
  email: string;
}

export default function SuggestAgentCTA({ email }: SuggestAgentCTAProps) {
  const subject = "Agent Suggestion";
  const body = encodeURIComponent(
    `Hi Pamela,\n\nI'd like to suggest an agent for the SMF Clearinghouse.\n\nAgent name:\nWebsite / repo URL:\nWhat it does:\nTarget use cases:\nPricing (if known):\nWhat makes it stand out:\n\nThanks!`
  );
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;

  return (
    <div className="rounded-xl border border-hairline bg-panel p-6 md:p-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h3 className="text-lg font-medium text-foreground">Suggest an agent</h3>
          <p className="mt-1 text-sm text-foreground-secondary">
            Missing a tool we should list? Send a note to{" "}
            <a
              href={mailtoHref}
              className="text-accent hover:underline"
            >
              {email}
            </a>{" "}
            with the subject line <strong>Agent Suggestion</strong>. Include the
            agent name, website, what it does, and anything that makes it stand out.
          </p>
        </div>
        <a
          href={mailtoHref}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90"
        >
          <Mail className="h-4 w-4" />
          Email a suggestion
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
