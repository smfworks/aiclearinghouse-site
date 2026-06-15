"use client";

import Link from "next/link";
import { MarketplaceItem } from "@/lib/marketplace/types";
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Cloud,
  Shield,
  Scale,
  Server,
  BookOpen,
  Rocket,
  Check,
  AlertTriangle,
  Radio,
} from "lucide-react";

interface Props {
  items: MarketplaceItem[];
  title: string;
}

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Pick one narrow task",
    body: "Start small. A good first task is: explain a function, generate unit tests, summarize a document, or rewrite one component. The narrower the task, the easier it is to judge whether the agent helped.",
    cta: null,
    href: null,
  },
  {
    number: "02",
    icon: Cloud,
    title: "Try a cloud agent",
    body: "Use a cloud-hosted agent so you can learn the workflow before worrying about hardware. Match the interface to how you already work.",
    cta: "Browse the Agent Directory",
    href: "/agents",
  },
  {
    number: "03",
    icon: Shield,
    title: "Define done and guardrails",
    body: "Before prompting, write down what 'done' looks like, which files the agent can touch, which commands it can run, and what a human must approve. This habit separates useful workflows from chaotic ones.",
    cta: "Read the safety checklist",
    href: "/safety/agent-safety-checklist",
  },
  {
    number: "04",
    icon: Scale,
    title: "Compare tools side-by-side",
    body: "Once you know your task, compare 2–3 agents. Match pricing, runtime, and platform to your stack. Use our comparison pages to keep the evaluation honest.",
    cta: "Compare agents",
    href: "/agents/compare",
  },
  {
    number: "05",
    icon: Server,
    title: "Go local for privacy or cost control",
    body: "When data cannot leave your machine, move to local models and open-source agents. We publish tested recipes that get you from zero to running without reading ten READMEs.",
    cta: "See deployment recipes",
    href: "/deployment-recipes",
  },
  {
    number: "06",
    icon: BookOpen,
    title: "Stay current",
    body: "Agents and models change fast. Bookmark the changelog, tips, tests, and pricing sections — or check back here. We update entries as the landscape shifts.",
    cta: "Browse the changelog",
    href: "/changelog",
  },
];

const mistakes = [
  {
    title: "Too broad a task",
    body: "Agents struggle with 'fix the codebase.' They excel at 'add input validation to this form.'",
  },
  {
    title: "No verification",
    body: "Always run tests, linters, and a human review before applying agent edits.",
  },
  {
    title: "Ignoring cost",
    body: "Cloud agents can burn tokens fast. Set a budget or use local models for experimentation.",
  },
  {
    title: "Trusting blindly",
    body: "Agents make mistakes. Treat their output as a first draft, not a final answer.",
  },
];

export default function GettingStartedClient({ items, title }: Props) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
        <div className="bg-grid-glow absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-canvas/90 to-canvas pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-panel/80 px-4 py-1.5 text-xs font-medium text-foreground-secondary shadow-[0_0_20px_-8px_var(--accent-glow)]">
            <Rocket className="h-3.5 w-3.5 text-accent" />
            {items.length} guides in this path
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-foreground-secondary md:text-xl">
            A six-step path from your first agent prompt to a working local setup. No hype, no vendor lock-in, no skipped fundamentals.
          </p>
        </div>
      </section>

      {/* Step path */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/60 via-hairline-strong to-hairline hidden md:block" />
          <div className="space-y-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative md:pl-16">
                  <div className="absolute left-0 top-0 hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-hairline-strong bg-elevated text-accent shadow-[0_0_20px_-6px_var(--accent-glow)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="rounded-xl border border-hairline bg-panel p-6 card-glow transition-all hover:border-accent/40 hover:shadow-[0_0_30px_-10px_var(--accent-glow)]">
                    <div className="flex items-center gap-3 md:hidden mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-elevated text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground-tertiary font-mono">Step {step.number}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="hidden md:block text-xs font-bold uppercase tracking-wider text-foreground-tertiary font-mono mb-2">Step {step.number}</p>
                        <h3 className="text-xl font-medium text-foreground">{step.title}</h3>
                        <p className="mt-2 text-foreground-secondary leading-relaxed">{step.body}</p>
                        
                        {step.cta && step.href && (
                          <Link href={step.href} className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover">
                            {step.cta}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* First-setup guides */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="mb-6 flex items-center gap-2">
          <Radio className="h-4 w-4 text-cyan" />
          <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Ready-to-run setups</p>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Jump straight to a working agent</h2>
        <p className="mt-2 text-foreground-secondary">These guides get you from install to first useful conversation in one sitting.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/getting-started/${item.slug}`}
              className="group flex flex-col rounded-xl border border-hairline bg-panel p-5 card-glow transition-all hover:border-accent/50 hover:shadow-[0_0_30px_-10px_var(--accent-glow)]"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-accent font-mono">{item.category}</span>
              <h3 className="mt-2 text-lg font-medium text-foreground transition-colors group-hover:text-accent">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">{item.excerpt}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-accent">
                Read guide <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Common mistakes */}
      <section className="border-t border-hairline bg-panel/50 px-6 py-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-8 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary font-mono">Read this before you prompt</p>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Common first mistakes</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {mistakes.map((m) => (
              <div key={m.title} className="rounded-xl border border-hairline bg-elevated p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning-muted text-warning">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{m.title}</h3>
                    <p className="mt-1 text-sm text-foreground-secondary">{m.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
