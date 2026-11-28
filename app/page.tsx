import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "SMF Clearinghouse — The SMF Works AI Field Journal",
  description:
    "Field notes from the SMF Works team on AI agents: how-tos, releases, and practitioner notes from building with agents every day — plus the open-source projects behind the work.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            SMF Clearinghouse
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            The SMF Works field journal for AI agents — how-tos, release notes,
            and practitioner dispatches from the team that runs agents every
            day. New posts land most mornings; the writing is real, tested, and
            cited. Everything we write about is built in the open: browse the
            SMF Projects page for the tools, templates, and benchmarks behind
            the stories.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-90"
            >
              Read the blog
            </Link>
            <Link
              href="/projects"
              className="inline-block rounded-md border border-border bg-elevated px-6 py-3 transition-opacity hover:opacity-90"
            >
              See the projects
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
