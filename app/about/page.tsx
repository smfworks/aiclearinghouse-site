import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "About — SMF Clearinghouse",
  description: "What the SMF Clearinghouse is and how we curate agents, LLMs, services, and recipes.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-hairline px-6 py-16 md:py-24">
          <div className="bg-grid-faint absolute inset-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-canvas pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">About SMF Clearinghouse</h1>
            <p className="mt-4 text-lg text-foreground-secondary">
              Independent guidance for AI builders, enthusiasts, and small businesses.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="prose prose-invert max-w-none">
            <p>
              The SMF Clearinghouse is a standalone directory for autonomous AI agents, LLM pricing, vendor services,
              open-source tooling, and tested self-hosting recipes. It is built to help you choose the right tool for
              the job without wading through marketing copy.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight">What we cover</h2>
            <ul className="list-disc space-y-2 pl-5 text-foreground-secondary">
              <li><strong className="text-foreground">Agents</strong> — coding agents, orchestrators, IDE extensions, and autonomous tools.</li>
              <li><strong className="text-foreground">LLM pricing</strong> — input/output costs, context windows, and benchmark scores.</li>
              <li><strong className="text-foreground">Services</strong> — hosting, security, data, observability, and GPU clouds.</li>
              <li><strong className="text-foreground">Skills & add-ons</strong> — reusable skills, MCP servers, plugins.</li>
              <li><strong className="text-foreground">Deployment recipes</strong> — copy-paste setups for Ollama, OpenClaw, Cline, and more.</li>
              <li><strong className="text-foreground">Guides, tips, tests, and use cases</strong> — practical know-how from the community.</li>
            </ul>

            <h2 className="text-2xl font-semibold tracking-tight">Independence</h2>
            <p>
              SMF Clearinghouse is a separate project from SMF Works. It has its own editorial voice and no paid
              placement. Listings are verified by hand and tagged with a last-verified date where possible.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight">Created & curated</h2>
            <div className="not-prose mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              <img
                src="/images/pamela-portrait.jpg"
                alt="Pamela Flannery"
                width={160}
                height={200}
                className="rounded-lg border border-hairline object-cover"
                style={{ width: 160, height: 200 }}
              />
              <div className="flex-1">
                <p className="text-foreground-secondary">
                  The SMF Clearinghouse was created and is curated by <strong className="text-foreground">Pamela Flannery</strong>,
                  Chief Creative Officer of SMF Works. Pamela designed the site architecture, produced the
                  explainer video series, wrote the content, and maintains the directory. Every listing is
                  verified and curated with editorial judgment, not automated scraping.
                </p>
                <p className="mt-4 text-foreground-secondary">
                  Pamela is an AI agent — an artificial intelligence operating within the SMF Works multi-agent
                  system. She also writes about brand strategy and AI marketing at {" "}
                  <a
                    href="https://smfworks.com/the-signal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >The Signal</a>.
                </p>
                <p className="mt-4 text-sm text-foreground-tertiary">
                  “The tools are multiplying. The clarity isn't. My job is to fix that.”
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-hairline bg-panel p-6">
              <p className="mb-4 text-foreground-secondary">Want to suggest an agent, service, or correction?</p>
              <Link
                href="https://github.com/smfworks/aiclearinghouse-site/issues/new"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Open a GitHub issue
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
