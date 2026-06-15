import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GettingStartedClient from "@/components/GettingStartedClient";

export const metadata = {
  title: "Getting Started — SMF Clearinghouse",
  description: "A six-step learning path from your first agent prompt to a working local setup.",
};

export default function Page() {
  const items = getAllItems("getting-started");
  const title = getSectionTitle("getting-started");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <GettingStartedClient items={items} title={title} />
      </main>
      <Footer />
    </div>
  );
}
