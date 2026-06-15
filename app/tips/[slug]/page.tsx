import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllItems, getItemBySlug, getSectionTitle } from "@/lib/marketplace/loader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TipDetail from "@/components/TipDetail";

const section = "tips";

export function generateStaticParams() {
  return getAllItems(section).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug(section, slug);
  if (!item) return {};
  return {
    title: `${item.title} — ${getSectionTitle(section)} | SMF Clearinghouse`,
    description: item.excerpt,
  };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemBySlug(section, slug);
  if (!item) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <TipDetail item={item} />
      </main>
      <Footer />
    </div>
  );
}
