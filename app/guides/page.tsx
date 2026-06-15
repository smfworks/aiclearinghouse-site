import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";

export const metadata = {
  title: "How-To Guides — SMF Clearinghouse",
  description: "Curated starting points and deep dives for AI builders.",
};

export default function GuidesPage() {
  const items = getAllItems("guides");
  const title = getSectionTitle("guides");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="guides"
          title={title}
          description="Curated starting points from your first agent to local self-hosting."
        />
      </main>
      <Footer />
    </div>
  );
}
