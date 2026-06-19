import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllItems, getItemBySlug, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDetail from "@/components/SectionDetail";

const section = "methodology";

export function generateStaticParams() {
  return getAllItems(section).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemBySlug(section, slug);
  if (!item) return {};
  return {
    title: `${item.title} — ${getSectionTitle(section)} | SMF Clearinghouse`,
    description: item.excerpt,
  };
}

export default async function MethodologyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemBySlug(section, slug);
  if (!item) {
    // Fallback: render the methodology.md content directly if no slug match
    const methodologyItem = getItemBySlug(section, "methodology");
    if (!methodologyItem) {
      return (
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1 px-6 py-12">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-3xl font-semibold">Methodology</h1>
              <p className="mt-4 text-foreground-secondary">Methodology content coming soon.</p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }
    return (
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">
          <SectionDetail item={methodologyItem} section={section} sectionTitle={getSectionTitle(section)} backHref="/" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDetail item={item} section={section} sectionTitle={getSectionTitle(section)} backHref="/" />
      </main>
      <Footer />
    </div>
  );
}
