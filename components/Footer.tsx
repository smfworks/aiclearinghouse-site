import Link from "next/link";
import { ArrowUpRight, Cpu, GitBranch, Heart } from "lucide-react";

export const SUPPORT_THE_LAB_URL =
  "https://donate.stripe.com/14A6oGbHv3hHekY2ODew801";

const links = [
  { href: "/blog/", label: "Blog" },
  { href: "/projects/", label: "SMF Projects" },
  { href: "https://smfworks.com", label: "SMF Works", external: true },
  { href: "https://smfwisdomforge.com", label: "SMF WisdomForge", external: true },
  { href: "https://agentshootout.com", label: "Agent Shootout", external: true },
  { href: "https://github.com/smfworks", label: "GitHub", external: true },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-hairline bg-panel">
      <div className="hairline-signal-subtle h-px w-full" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-96 rounded-full bg-cyan/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-56 w-80 rounded-full bg-accent/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Link
              href="/"
              prefetch={false}
              className="group inline-flex items-center gap-2.5 rounded-lg text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan/30 bg-gradient-to-br from-elevated via-panel to-canvas text-cyan shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:border-accent/55 group-hover:text-accent-hover">
                <Cpu className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold tracking-[-0.02em]">
                SMF Clearinghouse
              </span>
            </Link>
            <p className="mt-3.5 text-sm leading-relaxed text-foreground-secondary">
              Independent AI R&amp;D at the intersection of human-AI interaction, autonomous agents, and personal and organizational transformation.
            </p>
            <div className="mt-5">
              <a
                href={SUPPORT_THE_LAB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent transition-all duration-200 hover:border-accent/65 hover:bg-accent/18 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel"
              >
                <Heart className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span>Support the lab</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
            {links.map((l) =>
              "external" in l && l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  <span>{l.label}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-foreground-tertiary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch={false}
                  className="text-foreground-secondary transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  {l.label}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-hairline/80 pt-6 text-xs text-foreground-tertiary md:flex-row">
          <p className="font-mono tracking-wide">
            © {new Date().getFullYear()} SMF Clearinghouse · Curated by Pamela Flannery · Built by SMF Works
          </p>
          <a
            href="https://github.com/smfworks/aiclearinghouse-site"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-elevated/60 px-3 py-1.5 font-mono text-xs text-foreground-secondary transition-all hover:border-cyan/40 hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GitBranch className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
