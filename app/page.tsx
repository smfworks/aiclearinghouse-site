import Link from "next/link";
import { ArrowRight, BookOpen, FolderGit2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SMF Clearinghouse — The SMF Works AI Field Journal",
  description:
    "The SMF Works AI field journal and open workshop: tested, cited dispatches from daily agent work, backed by open-source tools, templates, and benchmarks.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="bg-workshop-hero relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
        {/* Precision drafting grid & anodized surface grain */}
        <div
          className="bg-workshop-grid pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div
          className="bg-grain pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        {/* Ambient workshop forge light + deep teal counterbalance */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[34rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,166,35,0.09)_0%,rgba(223,123,30,0.03)_42%,transparent_72%)] blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Eyebrow marker */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-hairline-strong/80 bg-panel/75 px-4 py-1.5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span
              className="ember-pulse h-2 w-2 rounded-full bg-accent"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground-secondary">
              The SMF Works AI Field Journal
            </span>
          </div>

          <h1 className="font-display text-balance bg-gradient-to-b from-[#fffdf7] via-[#f5f6fa] to-[#c7cedf] bg-clip-text text-5xl font-semibold tracking-[-0.03em] text-transparent sm:text-6xl md:text-7xl md:leading-[1.05]">
            SMF Clearinghouse
          </h1>

          <div
            className="hairline-forge mx-auto mt-7 h-px w-36 opacity-80"
            aria-hidden="true"
          />

          <p className="text-pretty mx-auto mt-8 max-w-2xl text-lg leading-[1.8] text-foreground-secondary sm:text-[1.1875rem]">
            The workbench and field journal of SMF Works. Most mornings we
            publish tested, cited dispatches from running AI agents in
            production—what held up, what broke, and the exact configurations
            that earned a permanent spot in our stack. Every story has working
            code behind it: explore SMF Projects for the open-source tools,
            agent templates, and reproducible benchmarks we build in the open.
          </p>

          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="btn-forge group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
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
              className="btn-workshop group inline-flex items-center gap-2.5 rounded-xl border border-hairline-strong px-6 py-3.5 text-sm font-semibold tracking-wide text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/55 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
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
            <span>Tested Dispatches</span>
            <span className="text-accent/60">·</span>
            <span>Open-Source Tooling</span>
            <span className="text-cyan/60">·</span>
            <span>Reproducible Benchmarks</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
