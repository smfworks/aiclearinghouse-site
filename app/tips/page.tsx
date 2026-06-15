import { getAllItems } from "@/lib/marketplace/loader";
import TipsDirectoryClient from "@/components/TipsDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Tips & Tricks — SMF Clearinghouse",
  description: "Practical habits that make AI agents safer, cheaper, and more useful.",
};

export default function TipsPage() {
  const items = getAllItems("tips");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <TipsDirectoryClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
