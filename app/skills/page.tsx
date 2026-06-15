import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("skills") + " — SMF Clearinghouse",
  description: "Browse skills on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("skills");
  const title = getSectionTitle("skills");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="skills"
          title={title}
          description="Curated entries for skills from the SMF Clearinghouse."
        />
      </main>
      <Footer />
    </div>
  );
}
