import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("services") + " — SMF Clearinghouse",
  description: "Browse services on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("services");
  const title = getSectionTitle("services");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="services"
          title={title}
          description="Curated entries for services from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
