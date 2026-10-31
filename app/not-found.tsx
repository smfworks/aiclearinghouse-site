import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page could not be found</h1>
        <p className="mt-4 max-w-md text-foreground-secondary">
          That address is not on the clearinghouse. Head home, or browse the latest AI headlines.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Home
          </Link>
          <Link
            href="/ai-news"
            className="rounded-lg border border-hairline px-4 py-2 text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            AI News
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
