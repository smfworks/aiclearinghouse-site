import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("use-cases") + " — SMF Clearinghouse",
  description: "Browse use-cases on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("use-cases");
  const title = getSectionTitle("use-cases");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="use-cases"
          title={title}
          description="Curated entries for use-cases from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
