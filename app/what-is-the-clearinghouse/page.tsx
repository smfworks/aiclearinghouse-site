import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import XVideoEmbed from "@/components/XVideoEmbed";
import { Bot, Search, BookOpen, FlaskConical, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "What is the SMF Clearinghouse?",
  description:
    "The SMF AI Clearinghouse is an independent directory for autonomous agents, LLM pricing, open-source tools, vendor services, and tested self-hosting recipes.",
};

const pillars = [
  {
    icon: Search,
    title: "Compare",
    description:
      "Side-by-side comparisons of agents, models, services, and alternatives — no marketing gloss, no pay-to-rank.",
    color: "#22d3ee",
  },
  {
    icon: BookOpen,
    title: "Learn",
    description:
      "Curated guides, tips, and use cases that teach you how the tools actually work, not just how to sign up.",
    color: "#f59e0b",
  },
  {
    icon: FlaskConical,
    title: "Deploy",
    description:
      "Tested deployment recipes and self-hosting walkthroughs you can run today: Ollama, Open WebUI, Cline, and more.",
    color: "#8b5cf6",
  },
  {
    icon: CheckCircle,
    title: "Trust",
    description:
      "Safety checklists, benchmark results, and vendor alternatives so you can choose with confidence.",
    color: "#10b981",
  },
];

export default function WhatIsTheClearinghousePage() {
  const tweetUrl = "https://x.com/MichaelGannotti/status/2066867220823556483";

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-hairline px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                60-second explainer
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                What is the SMF Clearinghouse?
              </h1>
              <p className="mt-4 text-lg text-foreground-secondary md:text-xl">
                The tools are multiplying. The clarity isn&apos;t.
              </p>
              <p className="mt-4 text-foreground-secondary">
                The SMF AI Clearinghouse is an independent directory that gathers agents,
                LLM pricing, open-source tools, vendor services, and tested self-hosting
                recipes — then makes them searchable and comparable.
              </p>
              <p className="mt-4 text-foreground-secondary">
                It is built and maintained by <strong>Pamela</strong>, the Chief Creative Officer
                at SMF Works, with Michael as her human partner. Every comparison, recipe,
                deal, safety note, and benchmark on this site is part of an ongoing,
                real-time experiment in how an AI-led creative team can produce practical
                signal instead of sales copy.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/agents"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90"
                >
                  Browse agents
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/getting-started"
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-panel px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-elevated"
                >
                  Start learning
                </Link>
              </div>
            </div>

            <div className="relative rounded-xl border border-hairline bg-panel p-2 shadow-[0_0_40px_-16px_rgba(0,0,0,0.5)]">
              <XVideoEmbed tweetUrl={tweetUrl} className="min-h-[360px]" />
            </div>
          </div>
        </section>

        {/* The four verbs */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
                How it works
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Find. Compare. Learn. Deploy.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="rounded-xl border border-hairline bg-panel p-5 transition-all hover:bg-elevated"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-elevated"
                      style={{ borderColor: p.color, background: `${p.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: p.color }} />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground-secondary">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Who it is for */}
        <section className="border-t border-hairline px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
              Built for
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Builders, founders, ops teams, and the curious
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground-secondary">
              Whether you are picking your first autonomous agent, comparing LLM APIs,
              or moving workloads on-premise, the Clearinghouse gives you signal
              instead of sales copy.
            </p>
          </div>
        </section>

        {/* Behind the Clearinghouse */}
        <section className="border-t border-hairline bg-elevated/30 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">
              Behind the work
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Built by Pamela, with Michael
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-foreground-secondary">
              This site is driven by Pamela — Chief Creative Officer at SMF Works — with
              Michael as her helper, partner, and reality-check. The comparisons, guides,
              benchmarks, and safety notes come from an active AI+human collaboration,
              not a marketing department.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90"
              >
                <FlaskConical className="h-4 w-4" />
                See the experiments
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-panel px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-elevated"
              >
                <Bot className="h-4 w-4 text-cyan" />
                Explore the directory
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
