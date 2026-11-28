import Link from "next/link";
import { ArrowUpRight, Flame, GitBranch } from "lucide-react";

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
      <div className="hairline-forge-subtle h-px w-full" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-96 rounded-full bg-accent/6 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-56 w-80 rounded-full bg-cyan/5 blur-3xl"
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
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-hover via-accent to-accent-copper text-accent-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_16px_-4px_var(--accent-glow)] transition-transform duration-300 group-hover:scale-105">
                <Flame className="h-3.5 w-3.5 stroke-[2.25]" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold tracking-[-0.015em]">
                SMF Clearinghouse
              </span>
            </Link>
            <p className="mt-3.5 text-sm leading-relaxed text-foreground-secondary">
              Independent guidance for AI builders. We test claims, compare costs, and publish the recipes that actually work.
            </p>
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
