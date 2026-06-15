import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — AI Clearinghouse",
  description: "Independent guidance for choosing AI agents, models, and deployment options.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">About AI Clearinghouse</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            AI Clearinghouse is an independent directory for autonomous AI agents, LLM pricing,
            open-source tools, and self-hosting recipes. We focus on accuracy, tested setups, and
            clear comparisons — not vendor marketing copy.
          </p>
          <p className="mt-4 text-muted-foreground">
            Whether you are a beginner trying your first agent, a builder self-hosting on Linux, or a
            small business evaluating automation options, the goal is to give you trustworthy starting
            points and keep them current.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
