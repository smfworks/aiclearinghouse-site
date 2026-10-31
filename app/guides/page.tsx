import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getAllItems } from "@/lib/marketplace/loader";
import GuidesDirectoryClient from "@/components/GuidesDirectoryClient";
import { absoluteUrl } from "@/lib/site";
import { GUIDE_SECTION_LABEL, breadcrumbListJsonLd, jsonLdDocument } from "@/lib/seo";

export const metadata = {
  title: "How-To Guides — SMF Clearinghouse",
  description: "Curated starting points and deep dives for AI builders. Decision trees, evaluation frameworks, deployment guides, and security playbooks.",
  alternates: { canonical: "https://www.smfclearinghouse.com/guides" },
};

export default function GuidesPage() {
  const items = getAllItems("guides");
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd
        data={jsonLdDocument(
          breadcrumbListJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: GUIDE_SECTION_LABEL, url: absoluteUrl("/guides") },
          ]),
        )}
      />
      <Nav />
      <main className="flex-1">
        <GuidesDirectoryClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
