import Link from "next/link";
import type { AgentProfile } from "@/lib/marketplace/types";
import { ExternalLink, GitBranch, Check } from "lucide-react";

interface Props {
  agent: AgentProfile;
}

export default function AgentDetail({ agent }: Props) {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/agents"
        className="mb-6 inline-flex items-center text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        ← Back to directory
      </Link>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-panel">
        <div className="border-b border-hairline bg-elevated px-8 py-8 md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-canvas text-3xl font-medium text-foreground">
                {agent.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
                  {agent.name}
                </h1>
                <p className="mt-1 text-lg text-foreground-secondary">
                  {agent.company} · <span className="font-mono">{agent.releaseYear}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                  agent.openSource
                    ? "bg-success-muted text-success"
                    : "bg-warning-muted text-warning"
                }`}
              >
                {agent.pricing}
              </span>
              <span className="rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                {agent.runtime}
              </span>
              {agent.multiPlatform && (
                <span className="rounded-full border border-hairline bg-canvas px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                  Multi-platform
                </span>
              )}
            </div>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-foreground-secondary">
            {agent.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {agent.website && (
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {agent.repository && (
              <a
                href={agent.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-hairline-strong hover:text-accent"
              >
                View Source
                <GitBranch className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-8 px-8 py-10 md:grid-cols-2 md:px-12">
          <section>
            <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
              Key Features
            </h2>
            <ul className="space-y-3">
              {agent.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-foreground-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-5 text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
              Deployment & Integrations
            </h2>
            <div className="space-y-5">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary font-mono">
                  Platforms
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {agent.platforms.map((p) => (
                    <span key={p} className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-sm text-foreground-secondary">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary font-mono">
                  Categories
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {agent.categories.map((c) => (
                    <span key={c} className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-sm text-foreground-secondary">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {agent.model && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary font-mono">
                    Default / featured model
                  </span>
                  <p className="mt-2 rounded-md border border-hairline bg-canvas px-2.5 py-1 text-sm text-foreground inline-block">
                    {agent.model}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {agent.lastVerified && (
          <div className="border-t border-hairline bg-elevated px-8 py-3 text-xs text-foreground-tertiary font-mono md:px-12">
            Last verified: {agent.lastVerified}
          </div>
        )}
      </div>
    </div>
  );
}
