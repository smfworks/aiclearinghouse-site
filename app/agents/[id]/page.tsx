import { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAgentBySlug, getAllAgents } from "@/lib/marketplace/loader";
import Link from "next/link";

export function generateStaticParams() {
  return getAllAgents().map((agent) => ({ id: agent.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgentBySlug(id);
  if (!agent) return {};
  return {
    title: `${agent.name} — SMF Clearinghouse`,
    description: `${agent.tagline} Built by ${agent.company}. Pricing: ${agent.pricing}. Runtime: ${agent.runtime}.`,
    keywords: [agent.name, agent.company, "AI agent", ...agent.categories, agent.runtime, agent.pricing],
    openGraph: {
      title: `${agent.name} — Autonomous AI Agent`,
      description: agent.tagline,
      url: `https://smfclearinghouse.com/agents/${agent.id}`,
      siteName: "SMF Clearinghouse",
      type: "article",
    },
  };
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = getAgentBySlug(id);
  if (!agent) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Link href="/agents" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to directory
          </Link>

          <div className="mt-6 rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-secondary text-3xl font-bold text-secondary-foreground">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold md:text-4xl">{agent.name}</h1>
                  <p className="mt-1 text-lg text-muted-foreground">
                    {agent.company} · {agent.releaseYear}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${agent.openSource ? "bg-accent/10 text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {agent.pricing}
                </span>
                <span className="rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold">{agent.runtime}</span>
              </div>
            </div>

            <p className="mt-8 text-lg leading-relaxed">{agent.description}</p>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <section>
                <h2 className="mb-4 text-xl font-bold text-primary">Key Features</h2>
                <ul className="space-y-3">
                  {agent.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-xl font-bold text-primary">Deployment & Integrations</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-muted-foreground">Platforms:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {agent.platforms.map((p) => (
                        <span key={p} className="rounded-md border border-border px-2 py-1 text-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-muted-foreground">Categories:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {agent.categories.map((c) => (
                        <span key={c} className="rounded-md border border-border px-2 py-1 text-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {agent.model && (
                    <div>
                      <span className="text-sm font-semibold text-muted-foreground">Default / featured model:</span>
                      <p className="mt-1">{agent.model}</p>
                    </div>
                  )}

                  {agent.lastVerified && (
                    <div>
                      <span className="text-sm font-semibold text-muted-foreground">Last verified:</span>
                      <p className="mt-1">{agent.lastVerified}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Visit Website
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {agent.repository && (
                <a
                  href={agent.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  View Source
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
