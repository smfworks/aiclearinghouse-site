import { getAllItems } from "@/lib/marketplace/loader";
import AINewsClient from "@/components/AINewsClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "AI News — SMF Clearinghouse",
  description: "Curated AI news headlines updated throughout the day.",
};

export default function AINewsPage() {
  const items = getAllItems("ai-news");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <AINewsClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
