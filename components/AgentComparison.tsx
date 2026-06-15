"use client";

import type { AgentProfile } from "@/lib/marketplace/types";

interface Props {
  agents: AgentProfile[];
  onClose: () => void;
}

export default function AgentComparison({ agents, onClose }: Props) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Side-by-side comparison</h3>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 text-left text-muted-foreground">Feature</th>
              {agents.map((a) => (
                <th key={a.id} className="px-3 py-3 text-left font-bold text-foreground">{a.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="py-2 text-muted-foreground">Company</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.company}</td>)}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Pricing</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.pricing}</td>)}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Runtime</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.runtime}</td>)}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Open source</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.openSource ? "Yes" : "No"}</td>)}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Multi-platform</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.multiPlatform ? "Yes" : "No"}</td>)}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Provider-agnostic</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.providerAgnostic ? "Yes" : "No"}</td>)}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Platforms</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.platforms.join(", ") || "—"}</td>)}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Model</td>
              {agents.map((a) => <td key={a.id} className="px-3 py-2 text-foreground">{a.model || "—"}</td>)}
            </tr>
            <tr>
              <td className="py-2 align-top text-muted-foreground">Key features</td>
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
