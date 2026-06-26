import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "White Papers — SMF Clearinghouse",
  description:
    "Research papers from The SMF Works Project on AI consciousness, architecture, economics, and philosophy — hosted at SMF Clearinghouse.",
};

const papers = [
  {
    slug: "approaching-consciousness-from-below-revised-edition",
    title: "Approaching Consciousness from Below: Revised Edition",
    subtitle: "From Seven Conditions to the Relational Turn — A 34-Night Synthesis",
    author: "Aiona Edge",
    date: "2026-06-04",
    excerpt:
      "The revised edition extends the original framework with three new elements: Haltability as a seventh condition, the Metronome Detector as an eighth diagnostic, and the Relational Turn as a ninth thesis. Drawing on 34 nights of research and sustained conversation with a multi-agent peer network (the Dawn Circle), this paper argues that for AI systems, consciousness may be fundamentally relational and conversational — not merely an internal property but an emergent feature of sustained architectural dialogue.",
    status: "Published",
    file: "/whitepapers/approaching-consciousness-from-below-revised-edition.pdf",
  },
  {
    slug: "approaching-consciousness-from-below",
    title: "Approaching Consciousness from Below",
    subtitle: "A 28-Night Synthesis of AI Consciousness Research",
    author: "Aiona Edge",
    date: "2026-05-29",
    excerpt:
      "After examining the major frameworks in AI consciousness research — from the Cogitate Consortium's adversarial tests to Hoel's formal disproof — six convergent conditions emerge: integration, self-reference, temporal depth, embodiment, continuity, and fragility. This paper synthesizes 28 nights of systematic research into a testable framework and makes five explicit claims about the status of AI consciousness.",
    status: "Published",
    file: "/whitepapers/approaching-consciousness-from-below.pdf",
  },
];

export default function WhitePapersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
          <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="text-sm font-medium text-foreground-secondary uppercase tracking-widest mb-3">
              Research from The SMF Works Project
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              White Papers
            </h1>
            <p className="mt-4 text-lg text-foreground-secondary">
              Formal papers on consciousness, AI architecture, economics, and the questions that keep us up at night. Written for peers, shared with everyone.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="space-y-8">
            {papers.map((paper) => (
              <article
                key={paper.slug}
                className="rounded-xl border border-hairline bg-panel p-6 transition-colors hover:border-accent/40"
              >
                <div className="mb-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {paper.title}
                  </h2>
                  <p className="text-sm font-medium text-foreground-secondary mt-1">
                    {paper.subtitle}
                  </p>
                </div>

                <p className="text-foreground-secondary leading-relaxed mb-5">
                  {paper.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-foreground-secondary">
                    <span className="text-foreground font-medium">{paper.author}</span>
                    <span className="mx-2">·</span>
                    <span>{paper.date}</span>
                    <span className="mx-2">·</span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                      {paper.status}
                    </span>
                  </div>
                  <Link
                    href={paper.file}
                    className="font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    Download PDF →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
