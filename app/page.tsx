import Link from "next/link";
import { ArrowRight, BookOpen, FolderGit2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SMF Clearinghouse — The SMF Works AI Field Journal",
  description:
    "AI R&D at the intersection of human-AI interaction and personal and organizational transformation: tested, cited dispatches and open-source tools, templates, and benchmarks from SMF Works.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="bg-rd-hero relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
        {/* Precision coordinate grid & subtle micro-grain */}
        <div
          className="bg-rd-grid pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div
          className="bg-grain pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        {/* Ambient cyan/copper telemetry illumination */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[34rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08)_0%,rgba(245,166,35,0.06)_44%,transparent_72%)] blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Eyebrow signal marker */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-hairline-strong/80 bg-panel/80 px-4 py-1.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span
              className="signal-pulse h-2 w-2 rounded-full bg-cyan"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground-secondary">
              SMF Works · AI R&amp;D Field Journal
            </span>
          </div>

          <h1 className="font-display text-balance bg-gradient-to-b from-[#ffffff] via-[#f0f3fa] to-[#b9c4da] bg-clip-text text-5xl font-bold tracking-[-0.035em] text-transparent sm:text-6xl md:text-7xl md:leading-[1.04]">
            SMF Clearinghouse
          </h1>

          <div
            className="hairline-signal mx-auto mt-7 h-px w-40 opacity-85"
            aria-hidden="true"
          />

          <p className="text-pretty mx-auto mt-8 max-w-2xl text-lg leading-[1.8] text-foreground-secondary sm:text-[1.15rem]">
            Applied AI R&amp;D from the SMF Works lab, examining the
            intersection of human-AI interaction and personal and organizational
            transformation in the age of autonomous AI. Most mornings we publish
            tested, cited dispatches from running live autonomous agent systems—what
            held up, what broke, and the exact architectures that earned a place
            in production. Every dispatch is backed by code built in the open:
            explore SMF Projects for the open-source tools, agent templates, and
            reproducible benchmarks behind the research.
          </p>

          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="btn-signal group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <BookOpen className="h-4 w-4 stroke-[2.25]" aria-hidden="true" />
              <span>Read the blog</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/projects"
              className="btn-surface group inline-flex items-center gap-2.5 rounded-xl border border-hairline-strong px-6 py-3.5 text-sm font-semibold tracking-wide text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/55 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <FolderGit2 className="h-4 w-4 text-cyan" aria-hidden="true" />
              <span>See the projects</span>
              <ArrowRight
                className="h-4 w-4 text-foreground-tertiary transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-cyan"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-hairline/70 pt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-tertiary"
            aria-hidden="true"
          >
            <span>Human-AI Interaction</span>
            <span className="text-cyan/60">·</span>
            <span>Autonomous Systems R&amp;D</span>
            <span className="text-accent/60">·</span>
            <span>Open Benchmarks</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
