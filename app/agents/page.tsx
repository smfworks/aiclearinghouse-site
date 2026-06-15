import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllAgents, getAgentCategories, getAgentRuntimes, getAgentPricings } from "@/lib/marketplace/loader";
import Link from "next/link";

export const metadata = {
  title: "Agent Directory — SMF Clearinghouse",
  description: "Compare autonomous AI agents side-by-side by runtime, pricing, platform, and use case.",
};

export default function AgentsPage() {
  const agents = getAllAgents();
  const categories = getAgentCategories();
  const runtimes = getAgentRuntimes();
  const pricings = getAgentPricings();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">Agent Directory</h1>
            <p className="mt-2 text-muted-foreground">{agents.length} agents compared by runtime, pricing, platform, and source availability.</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 text-sm">
            <span className="font-medium text-muted-foreground">Filters:</span>
            {runtimes.map((r) => (
              <span key={r} className="rounded-full border border-border px-3 py-1">{r}</span>
            ))}
            {pricings.map((p) => (
              <span key={p} className="rounded-full border border-border px-3 py-1">{p}</span>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-secondary-foreground">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold transition-colors group-hover:text-primary">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.company}</p>
                    </div>
                  </div>
                  {agent.openSource && (
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      Open Source
                    </span>
                  )}
                </div>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">{agent.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{agent.pricing}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{agent.runtime}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{agent.releaseYear}</span>
                </div>
                {agent.lastVerified && (
                  <p className="mt-3 text-xs text-muted-foreground">Verified {agent.lastVerified}</p>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <span key={c} className="rounded-full border border-border px-3 py-1 text-sm">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
