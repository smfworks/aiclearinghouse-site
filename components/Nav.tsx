"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Cpu, Menu, X } from "lucide-react";

const links = [
  { href: "/blog/", label: "Blog" },
  { href: "/projects/", label: "SMF Projects" },
];

const externalLinks = [
  { href: "https://smfworks.com", label: "SMF Works" },
  { href: "https://smfwisdomforge.com", label: "SMF WisdomForge" },
  { href: "https://agentshootout.com", label: "Agent Shootout" },
  { href: "https://github.com/smfworks", label: "GitHub" },
];

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return normalizedPath === href || normalizedPath.startsWith(href);
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-hairline/90 bg-canvas/82 backdrop-blur-xl">
      <div className="hairline-signal h-px w-full opacity-75" aria-hidden="true" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          prefetch={false}
          className="group flex items-center gap-3 rounded-lg py-0.5 text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/30 bg-gradient-to-br from-elevated via-panel to-canvas text-cyan shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_-6px_var(--cyan-glow)] transition-all duration-300 group-hover:border-accent/55 group-hover:text-accent-hover group-hover:shadow-[0_0_22px_-4px_var(--accent-glow)]">
            <Cpu className="h-4 w-4 stroke-[2]" aria-hidden="true" />
          </span>
          <span className="hidden flex-col sm:flex">
            <span className="font-display text-[1.05rem] font-semibold leading-none tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent-hover">
              SMF Clearinghouse
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-tertiary">
              AI R&amp;D Field Journal
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm lg:flex" aria-label="Primary">
          {links.map((l) => {
            const active = isActivePath(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-3.5 py-1.5 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                  active
                    ? "bg-elevated/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "text-foreground-secondary hover:bg-elevated/70 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {active && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
                      aria-hidden="true"
                    />
                  )}
                  {l.label}
                </span>
              </Link>
            );
          })}

          <span
            className="mx-2 h-4 w-px bg-hairline-strong/80"
            aria-hidden="true"
          />

          {externalLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-foreground-secondary transition-colors duration-200 hover:bg-elevated/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <span>{l.label}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 text-foreground-tertiary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-lg border border-hairline/80 bg-elevated/60 p-2 text-foreground-secondary transition-colors hover:border-hairline-strong hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-panel/95 px-6 py-5 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1.5">
            <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-tertiary">
              Clearinghouse
            </p>
            {links.map((l) => {
              const active = isActivePath(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border border-accent/30 bg-elevated text-foreground"
                      : "text-foreground-secondary hover:bg-elevated/80 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
                      aria-hidden="true"
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}

            <div className="my-2 h-px bg-hairline" aria-hidden="true" />

            <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-tertiary">
              SMF Works Network
            </p>
            {externalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground-secondary transition-colors hover:bg-elevated/80 hover:text-foreground"
              >
                <span>{l.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-foreground-tertiary" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
