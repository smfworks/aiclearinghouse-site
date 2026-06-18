import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("alternatives") + " — SMF Clearinghouse",
  description: "Browse alternatives on the SMF Clearinghouse.",
};

export default function Page() {
  const items = getAllItems("alternatives");
  const title = getSectionTitle("alternatives");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="alternatives"
          title={title}
          description="Curated alternatives to the most popular AI chatbots, coding agents, editors, research tools, and local runtimes — with honest tradeoffs and migration paths."
        />
      </main>
      <Footer />
    </div>
  );
}
