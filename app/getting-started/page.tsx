import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("getting-started") + " — SMF Clearinghouse",
  description: "Browse getting-started on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("getting-started");
  const title = getSectionTitle("getting-started");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="getting-started"
          title={title}
          description="Curated entries for getting-started from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
