import Link from "next/link";
import type { AgentProfile } from "@/lib/marketplace/types";
import { Cpu, Globe } from "lucide-react";
import FreshnessBadge from "@/components/FreshnessBadge";

interface AgentCardProps {
  agent: AgentProfile;
  compare?: {
    selected: boolean;
    onToggle: () => void;
    disabled: boolean;
  };
}

const runtimeColors: Record<string, string> = {
  Local: "text-emerald bg-emerald/10 border-emerald/30",
  Cloud: "text-cyan bg-cyan/10 border-cyan/30",
  Hybrid: "text-amber bg-amber/10 border-amber/30",
};

export default function AgentCard({ agent, compare }: AgentCardProps) {
  const runtimeStyle = runtimeColors[agent.runtime] || runtimeColors.Hybrid;

  return (
    <article
      data-agent-name={agent.id}
      className="group relative h-full rounded-xl border border-hairline bg-panel p-5 transition-all duration-200 card-glow hover:border-cyan/50 hover:shadow-[0_0_30px_-10px_var(--cyan-glow)]"
    >
      {compare && (
        <label
          className="absolute right-3 top-3 z-10 flex cursor-pointer items-center gap-2 rounded-full border border-hairline bg-canvas px-2.5 py-1 text-xs text-foreground-secondary transition-colors hover:border-cyan hover:text-cyan"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={compare.selected}
            onChange={compare.onToggle}
            disabled={compare.disabled}
            className="accent-cyan"
          />
          Compare
        </label>
      )}

      <Link href={`/agents/${agent.id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-elevated to-panel text-lg font-semibold text-foreground border border-hairline group-hover:border-cyan/40 transition-colors"
              style={{ color: agent.id ? undefined : undefined }}
            >
              {agent.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-cyan">
                {agent.name}
              </h3>
              <p className="truncate text-sm text-foreground-secondary">{agent.company}</p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              agent.openSource
                ? "bg-success-muted text-success"
                : "bg-warning-muted text-warning"
            }`}
          >
            {agent.pricing}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-foreground-secondary">
          {agent.tagline}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className={`rounded-md border px-2.5 py-1 text-xs font-mono ${runtimeStyle}`}>
            {agent.runtime}
          </span>
          {agent.model && (
            <span className="rounded-md border border-hairline bg-canvas px-2.5 py-1 text-xs text-foreground-tertiary font-mono truncate max-w-[150px] inline-flex items-center gap-1.5">
              <Cpu className="h-3 w-3" />
              {agent.model}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {agent.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="rounded-full border border-hairline px-2.5 py-0.5 text-xs text-foreground-tertiary">
              {cat}
            </span>
          ))}
        </div>

        {agent.lastVerified && (
          <div className="mt-4">
            <FreshnessBadge dateString={agent.lastVerified} />
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs text-foreground-tertiary font-mono">
          <Globe className="h-3.5 w-3.5" />
          <span className="truncate">{agent.platforms.slice(0, 3).join(", ")}</span>
        </div>
      </Link>
    </article>
  );
}
