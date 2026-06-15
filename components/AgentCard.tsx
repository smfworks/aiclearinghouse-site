import Link from "next/link";
import type { AgentProfile } from "@/lib/marketplace/types";

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
    <article className="group relative h-full rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-sm">
      {compare && (
        <label className="absolute right-3 top-3 z-10 flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/90 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
          <input type="checkbox" checked={compare.selected} onChange={compare.onToggle} disabled={compare.disabled} className="accent-primary" />
          Compare
        </label>
      )}
      <Link href={`/agents/${agent.id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-lg font-bold text-secondary-foreground">
              {agent.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.company}</p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              agent.openSource
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
            }`}
          >
            {agent.pricing}
          </span>
        </div>

        <p className="mt-4 text-sm text-foreground line-clamp-2">{agent.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">{agent.runtime}</span>
          {agent.model && <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">{agent.model}</span>}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {agent.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {cat}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.477 0-4.758.18-6.843.502m15.686 0c.973 1.168 1.646 2.549 1.958 4.04" />
            </svg>
            {agent.platforms.slice(0, 3).join(", ")}
          </span>
        </div>
      </Link>
    </article>
  );
}
