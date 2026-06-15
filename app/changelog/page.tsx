import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("changelog") + " — SMF Clearinghouse",
  description: "Browse changelog on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("changelog");
  const title = getSectionTitle("changelog");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="changelog"
          title={title}
          description="Curated entries for changelog from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
