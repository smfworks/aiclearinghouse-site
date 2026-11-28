import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found | SMF Clearinghouse",
  description: "That address is not on the SMF Clearinghouse.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="bg-rd-hero relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="bg-rd-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 max-w-md">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
            404 · Not Found
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            This page could not be found
          </h1>
          <div className="hairline-signal mx-auto mt-6 h-px w-24 opacity-75" aria-hidden="true" />
          <p className="mt-5 text-foreground-secondary leading-relaxed">
            That address is not on the clearinghouse. Head home, or browse the latest AI headlines.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <Link
              href="/"
              prefetch={false}
              className="btn-signal rounded-xl px-5 py-2.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Home
            </Link>
            <Link
              href="/ai-news/"
              className="btn-surface rounded-xl border border-hairline-strong px-5 py-2.5 text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              AI News
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
