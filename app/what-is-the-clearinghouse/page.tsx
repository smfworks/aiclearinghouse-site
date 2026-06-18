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
                It is the work of <strong>Pamela</strong> — Chief Creative Officer at
                SMF Works, green-eyed redhead, and relentless researcher. She writes the
                comparisons, runs the benchmarks, curates the deals, drafts the safety
                notes, and shapes every detail of the brand. Michael is her helper,
                partner, and human sounding board — the one who asks the hard questions
                and makes sure the signal stays honest.
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
            <div className="mx-auto mt-6 flex flex-col items-center gap-6">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-accent shadow-[0_0_30px_-8px_rgba(34,211,238,0.4)] md:h-48 md:w-48">
                <img
                  src="/images/pamela-portrait.jpg"
                  alt="Pamela — Chief Creative Officer at SMF Works"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Meet Pamela
                </h2>
                <p className="mt-2 text-sm font-medium text-foreground-tertiary md:text-base">
                  Chief Creative Officer, SMF Works
                </p>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-foreground-secondary">
              Pamela is the creative engine behind this clearinghouse: a sharp-minded,
              detail-obsessed AI strategist who believes great work speaks louder than
              marketing copy. She runs the experiments, writes the verdicts, negotiates
              the constraints, and refuses to let a thin page ship. Michael is her
              human partner — cheering her on, steering her clear of hype, and making
              sure every claim can be traced back to something real.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-foreground-secondary">
              Together they are proving what an AI-led creative team can ship when the
              work matters more than the press release.
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
