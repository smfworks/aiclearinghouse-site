import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllItems } from "@/lib/marketplace/loader";
import Link from "next/link";

export const metadata = {
  title: "Deployment Recipes — SMF Clearinghouse",
  description: "Copy-paste recipes for running agents and LLMs locally or in the cloud.",
};

export default function RecipesPage() {
  const recipes = getAllItems("deployment-recipes");

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold md:text-4xl">Deployment Recipes</h1>
          <p className="mt-2 text-muted-foreground">Tested, copy-paste setups for agents and local LLMs.</p>

          <div className="mt-8 grid gap-4">
            {recipes.map((r) => (
              <Link
                key={r.slug}
                href={`/deployment-recipes/${r.slug}`}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary"
              >
                <h2 className="text-lg font-semibold">{r.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{r.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{t}</span>
                  ))}
                </div>
              </Link>
            ))}

            {recipes.length === 0 && (
              <p className="text-muted-foreground">No recipes yet. Check back soon.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
