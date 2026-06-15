import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllItems } from "@/lib/marketplace/loader";
import Link from "next/link";

export const metadata = {
  title: "Guides — AI Clearinghouse",
  description: "Curated how-to guides for AI agents, local LLMs, and self-hosting.",
};

export default function GuidesPage() {
  const guides = getAllItems("guides");

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold md:text-4xl">Guides</h1>
          <p className="mt-2 text-muted-foreground">Curated starting points and deep dives.</p>

          <div className="mt-8 grid gap-4">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary"
              >
                <h2 className="text-lg font-semibold">{g.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{g.excerpt}</p>
              </Link>
            ))}

            {guides.length === 0 && (
              <p className="text-muted-foreground">No guides yet. Check back soon.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
