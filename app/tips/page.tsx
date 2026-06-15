import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("tips") + " — SMF Clearinghouse",
  description: "Browse tips on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("tips");
  const title = getSectionTitle("tips");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="tips"
          title={title}
          description="Curated entries for tips from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
