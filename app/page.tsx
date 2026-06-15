import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllAgents } from "@/lib/marketplace/loader";
import Link from "next/link";

export default function Home() {
  const agents = getAllAgents();
  const featured = agents.filter((a) =>
    ["openclaw", "cline", "aider", "claude-code", "cursor"].includes(a.id)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border px-6 py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Independent AI Directory
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              SMF Clearinghouse
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Compare autonomous agents, LLM pricing, open-source tools, and tested self-hosting recipes.
              Built for builders, enthusiasts, and small businesses.
            </p>
            <div className="mx-auto mt-8 flex max-w-xl gap-3">
              <Link
                href="/agents"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse agents
              </Link>
              <Link
                href="/llms"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-card px-6 py-3 font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                LLM prices
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-8 text-2xl font-bold">Featured agents</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-secondary-foreground">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold transition-colors group-hover:text-primary">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.company}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{agent.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{agent.pricing}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{agent.runtime}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Link
              href="/deployment-recipes"
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary"
            >
              <div className="mb-3 text-2xl">🧪</div>
              <h3 className="text-lg font-semibold">Deployment Recipes</h3>
              <p className="mt-1 text-sm text-muted-foreground">Copy-paste setups for Ollama, OpenClaw, Cline, and more.</p>
            </Link>
            <Link
              href="/guides"
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary"
            >
              <div className="mb-3 text-2xl">📚</div>
              <h3 className="text-lg font-semibold">How-To Guides</h3>
              <p className="mt-1 text-sm text-muted-foreground">Curated starting points from your first agent to local self-hosting.</p>
            </Link>
            <Link
              href="/agents"
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary"
            >
              <div className="mb-3 text-2xl">⚡</div>
              <h3 className="text-lg font-semibold">LLM Pricing</h3>
              <p className="mt-1 text-sm text-muted-foreground">Compare costs, context windows, and benchmark scores.</p>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
