import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("tests") + " — SMF Clearinghouse",
  description: "Browse tests on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("tests");
  const title = getSectionTitle("tests");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="tests"
          title={title}
          description="Curated entries for tests from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
