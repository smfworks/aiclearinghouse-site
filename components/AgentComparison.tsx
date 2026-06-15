"use client";

import type { AgentProfile } from "@/lib/marketplace/types";

interface Props {
  agents: AgentProfile[];
  onClose: () => void;
}

export default function AgentComparison({ agents, onClose }: Props) {
  return (
    <div className="mb-8 rounded-xl border border-hairline bg-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">Side-by-side comparison</h3>
        <button onClick={onClose} className="text-sm text-foreground-secondary hover:text-foreground">
          Close
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline">
              <th className="py-3 pr-3 text-left text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Feature</th>
              {agents.map((a) => (
                <th key={a.id} className="px-3 py-3 text-left font-medium text-foreground">
                  {a.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {[
              { label: "Company", value: (a: AgentProfile) => a.company },
              { label: "Pricing", value: (a: AgentProfile) => a.pricing },
              { label: "Runtime", value: (a: AgentProfile) => a.runtime },
              { label: "Open source", value: (a: AgentProfile) => (a.openSource ? "Yes" : "No") },
              { label: "Multi-platform", value: (a: AgentProfile) => (a.multiPlatform ? "Yes" : "No") },
              { label: "Provider-agnostic", value: (a: AgentProfile) => (a.providerAgnostic ? "Yes" : "No") },
              { label: "Platforms", value: (a: AgentProfile) => a.platforms.join(", ") || "—" },
              { label: "Model", value: (a: AgentProfile) => a.model || "—" },
            ].map((row) => (
              <tr key={row.label}>
                <td className="py-2 pr-3 text-foreground-secondary font-mono text-xs">{row.label}</td>
                {agents.map((a) => (
                  <td key={a.id} className="px-3 py-2 text-foreground">{row.value(a)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-2 pr-3 align-top text-foreground-secondary font-mono text-xs">Key features</td>
              {agents.map((a) => (
                <td key={a.id} className="px-3 py-2 align-top text-foreground">
                  <ul className="list-disc space-y-1 pl-4">
                    {a.features.slice(0, 4).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
