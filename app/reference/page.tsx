import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Reference — SMF Clearinghouse",
  description:
    "Guides, recipes, reviews, skills, and filed notes. Reference, not a second blog.",
};

const sections = [
  { href: "/guides", label: "Guides", note: "Longer how-to paths." },
  { href: "/deployment-recipes", label: "Recipes", note: "Copy-paste setups." },
  { href: "/reviews", label: "Reviews", note: "What we looked at, with the limits named." },
  { href: "/skills", label: "Skills", note: "Reusable skills and add-ons." },
  { href: "/tips", label: "Tips", note: "Short notes a builder can use." },
  { href: "/whitepapers", label: "White papers", note: "Longer papers, when we have them." },
  { href: "/ai-news", label: "News", note: "Filed reporting. Not the essay feed." },
];

export default function ReferencePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="border-b border-hairline px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              Reference
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">The shelf, not the feed</h1>
            <p className="mt-4 text-lg text-foreground-secondary">
              These pages stay. They just leave the top of the site. Blog is the essay feed. This is where you look something up.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-12">
          <ul className="space-y-4">
            {sections.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group block rounded-lg border border-hairline bg-panel px-5 py-4 transition-colors hover:border-accent">
                  <span className="text-lg font-semibold text-foreground group-hover:text-accent">{item.label}</span>
                  <p className="mt-1 text-sm text-foreground-secondary">{item.note}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
