import { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import SectionDetail from "@/components/SectionDetail";
import { getAllItems, getItemBySlug, getSectionTitle } from "@/lib/marketplace/loader";
import { fitPageTitle, guideArticleJsonLd, isoDate, truncateMetaDescription } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const section = "guides";

export function generateStaticParams() {
  return getAllItems(section).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug(section, slug);
  if (!item) return {};

  const title = fitPageTitle(item.title);
  const description = truncateMetaDescription(item.excerpt);
  const url = absoluteUrl(`/guides/${item.slug}`);
  const published = isoDate(item.last_verified);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "SMF Clearinghouse",
      type: "article",
      ...(published ? { publishedTime: published } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
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
