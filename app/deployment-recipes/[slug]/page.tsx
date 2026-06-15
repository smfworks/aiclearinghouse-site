import { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllItems, getItemBySlug } from "@/lib/marketplace/loader";
import Link from "next/link";

export function generateStaticParams() {
  return getAllItems("deployment-recipes").map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug("deployment-recipes", slug);
  if (!item) return {};
  return {
    title: `${item.title} — AI Clearinghouse`,
    description: item.excerpt,
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemBySlug("deployment-recipes", slug);
  if (!item) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Link href="/deployment-recipes" className="text-sm text-muted-foreground hover:text-primary">
            ← All recipes
          </Link>
          <article className="prose prose-neutral dark:prose-invert mt-6 max-w-none">
            <h1>{item.title}</h1>
            <p className="lead">{item.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\s*```(\w+)?\n([\s\S]*?)```\s*$/gim, "<pre><code>$2</code></pre>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/(\n<li>.*?\n)(?!(\s*<li>|\s*<\/ul>))/g, "<ul>$1</ul>\n")
    .replace(/\n/g, "<br />");
}
