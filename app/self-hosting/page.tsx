import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("self-hosting") + " — SMF Clearinghouse",
  description: "Browse self-hosting on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("self-hosting");
  const title = getSectionTitle("self-hosting");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="self-hosting"
          title={title}
          description="Curated entries for self-hosting from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
