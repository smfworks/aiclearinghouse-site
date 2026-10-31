import { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import SectionDetail from "@/components/SectionDetail";
import { getAllItems, getItemBySlug, getSectionTitle } from "@/lib/marketplace/loader";
import { guideArticleJsonLd, guidePageMetadata } from "@/lib/seo";

const section = "guides";

export function generateStaticParams() {
  return getAllItems(section).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug(section, slug);
  if (!item) return {};

  return guidePageMetadata({
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    date: item.last_verified,
    image: item.image,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItemBySlug(section, slug);
  if (!item) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={guideArticleJsonLd({
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          date: item.last_verified,
          image: item.image,
          authorName: typeof item.author === "string" ? item.author : undefined,
        })}
      />
      <Nav />
      <main className="flex-1">
        <SectionDetail item={item} section={section} sectionTitle={getSectionTitle(section)} backHref="/guides" />
      </main>
      <Footer />
    </div>
  );
}
