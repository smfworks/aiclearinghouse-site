import { getAllItems } from "@/lib/marketplace/loader";
import ReviewsDirectoryClient from "@/components/ReviewsDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SMF Reviews — SMF Clearinghouse",
  description: "Hands-on reviews of AI agents, tools, services, and hardware from the SMF Works team.",
};

export default function ReviewsPage() {
  const items = getAllItems("reviews");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <ReviewsDirectoryClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
