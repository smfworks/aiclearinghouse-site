import Link from "next/link";
import type { AgentProfile } from "@/lib/marketplace/types";
import { Globe } from "lucide-react";

interface AgentCardProps {
  agent: AgentProfile;
  compare?: {
    selected: boolean;
    onToggle: () => void;
    disabled: boolean;
  };
}

export default function AgentCard({ agent, compare }: AgentCardProps) {
  return (
    <article className="group relative h-full rounded-xl border border-hairline bg-panel p-5 transition-all hover:border-hairline-strong hover:bg-elevated">
      {compare && (
        <label className="absolute right-3 top-3 z-10 flex cursor-pointer items-center gap-2 rounded-full border border-hairline bg-canvas px-2.5 py-1 text-xs text-foreground-secondary transition-colors hover:border-accent hover:text-accent"
        onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={compare.selected}
            onChange={compare.onToggle}
            disabled={compare.disabled}
            className="accent-accent"
          />
          Compare
        </label>
      )}

      <Link href={`/agents/${agent.id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-elevated text-base font-medium text-foreground">
              {agent.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-medium text-foreground transition-colors group-hover:text-accent">
                {agent.name}
              </h3>
              <p className="truncate text-sm text-foreground-secondary">{agent.company}</p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
              agent.openSource
                ? "bg-success-muted text-success"
                : "bg-warning-muted text-warning"
            }`}
          >
            {agent.pricing}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm text-foreground-secondary">{agent.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md border border-hairline bg-canvas px-2 py-0.5 text-xs text-foreground-secondary font-mono">{agent.runtime}</span>
          {agent.model && (
            <span className="rounded-md border border-hairline bg-canvas px-2 py-0.5 text-xs text-foreground-secondary font-mono">
              {agent.model}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {agent.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="rounded-full border border-hairline px-2 py-0.5 text-xs text-foreground-tertiary">
              {cat}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-xs text-foreground-tertiary font-mono">
          <Globe className="h-3.5 w-3.5" />
          <span className="truncate">{agent.platforms.slice(0, 3).join(", ")}</span>
        </div>
      </Link>
    </article>
  );
}
