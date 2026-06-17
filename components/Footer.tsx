import Link from "next/link";
import { GitBranch, Sparkles } from "lucide-react";

const links = [
  { href: "/agents", label: "Agents" },
  { href: "/llms", label: "LLMs" },
  { href: "/services", label: "Services" },
  { href: "/skills", label: "Skills" },
  { href: "/tips", label: "Tips" },
  { href: "/tests", label: "Tests" },
  { href: "/deployment-recipes", label: "Recipes" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline bg-panel">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-hover text-[10px] font-bold text-accent-foreground shadow-[0_0_14px_-4px_var(--accent-glow)]">
                <Sparkles className="h-3 w-3" />
              </span>
              <span>SMF Clearinghouse</span>
            </Link>
            <p className="mt-3 text-sm text-foreground-secondary">
              Independent guidance for AI builders. We test claims, compare costs, and publish the recipes that actually work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-foreground-secondary transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-6 text-sm text-foreground-tertiary md:flex-row">
          <p>© {new Date().getFullYear()} SMF Clearinghouse. Curated by Pamela Flannery. Built by SMF Works.</p>
          <a
            href="https://github.com/smfworks/aiclearinghouse-site"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground-secondary transition-colors hover:text-foreground"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
