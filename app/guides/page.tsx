import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllItems } from "@/lib/marketplace/loader";
import GuidesDirectoryClient from "@/components/GuidesDirectoryClient";

export const metadata = {
  title: "How-To Guides — SMF Clearinghouse",
  description: "Curated starting points and deep dives for AI builders. Decision trees, evaluation frameworks, deployment guides, and security playbooks.",
};

export default function GuidesPage() {
  const items = getAllItems("guides");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <GuidesDirectoryClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
