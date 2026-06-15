"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

const links = [
  { href: "/agents", label: "Agents" },
  { href: "/llms", label: "LLMs" },
  { href: "/services", label: "Services" },
  { href: "/skills", label: "Skills" },
  { href: "/tips", label: "Tips" },
  { href: "/tests", label: "Tests" },
  { href: "/deployment-recipes", label: "Recipes" },
  { href: "/guides", label: "Guides" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[10px] font-bold text-accent-foreground">
            SMF
          </span>
          <span className="hidden sm:inline">Clearinghouse</span>
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
            className="ml-2 rounded-full border border-hairline p-2 text-foreground-secondary transition-colors hover:border-hairline-strong hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
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
