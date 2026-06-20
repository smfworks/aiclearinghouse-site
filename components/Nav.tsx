"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Sparkles } from "lucide-react";

const links = [
  { href: "/agents", label: "Agents" },
  { href: "/llms", label: "LLMs" },
  { href: "/services", label: "Services" },
  { href: "/skills", label: "Skills" },
  { href: "/tips", label: "Tips" },
  { href: "/tests", label: "Tests" },
  { href: "/deployment-recipes", label: "Recipes" },
  { href: "/guides", label: "Guides" },
  { href: "/ai-news", label: "News" },
  { href: "/reviews", label: "Reviews" },
  { href: "/what-is-the-clearinghouse", label: "What is this?" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-hover text-[10px] font-bold text-accent-foreground shadow-[0_0_16px_-4px_var(--accent-glow)] transition-transform group-hover:scale-105">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="hidden sm:inline">SMF Clearinghouse</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-foreground-secondary transition-colors hover:bg-elevated hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-foreground-secondary transition-colors hover:border-accent hover:text-accent"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </Link>
        </nav>

        <button
          className="rounded-md p-2 text-foreground-secondary transition-colors hover:bg-elevated lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-panel px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-foreground-secondary transition-colors hover:bg-elevated hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
