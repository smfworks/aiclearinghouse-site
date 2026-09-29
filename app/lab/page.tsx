import Link from "next/link";
import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Lab — SMF Clearinghouse",
  description: "Tests, benchmarks, agents, and models you can inspect.",
};

const doors = [
  { href: "/tests", label: "Tests", note: "What we ran, and what we will not claim we ran." },
  { href: "/explorer", label: "Benchmarks", note: "The SMF benchmark explorer." },
  { href: "/agents", label: "Agents", note: "Tools in the directory. Not a hire-us page." },
  { href: "/llms", label: "Models", note: "Pricing, context, and the public numbers." },
];

export default function Page() {
  const items = getAllItems("lab");
  const title = getSectionTitle("lab");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="border-b border-hairline px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">Lab</p>
            <h1 className="text-4xl font-semibold tracking-tight">Work you can inspect</h1>
            <p className="mt-4 text-lg text-foreground-secondary">
              Tests, benchmarks, agents, and models. If we did not run it, it does not get a lab claim.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-6 py-12">
          <ul className="space-y-4">
            {doors.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group block rounded-lg border border-hairline bg-panel px-5 py-4 transition-colors hover:border-accent">
                  <span className="text-lg font-semibold text-foreground group-hover:text-accent">{item.label}</span>
                  <p className="mt-1 text-sm text-foreground-secondary">{item.note}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        {items.length > 0 && (
          <SectionDirectoryClient
            items={items}
            section="lab"
            title={title}
            description="Filed lab notes already on this site."
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
