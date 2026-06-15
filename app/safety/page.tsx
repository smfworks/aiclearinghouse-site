import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("safety") + " — SMF Clearinghouse",
  description: "Browse safety on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("safety");
  const title = getSectionTitle("safety");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="safety"
          title={title}
          description="Curated entries for safety from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
