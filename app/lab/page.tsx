import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("lab") + " — SMF Clearinghouse",
  description: "Browse lab on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("lab");
  const title = getSectionTitle("lab");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="lab"
          title={title}
          description="Curated entries for lab from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
