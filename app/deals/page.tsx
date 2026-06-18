import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("deals") + " — SMF Clearinghouse",
  description: "Browse deals on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("deals");
  const title = getSectionTitle("deals");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="deals"
          title={title}
          description="Curated startup credits, free tiers, and partner offers for AI APIs, GPU compute, cloud infrastructure, vector databases, and productivity tools."
        />
      </main>
      <Footer />
    </div>
  );
}
