import { getAllItems } from "@/lib/marketplace/loader";
import TestsDirectoryClient from "@/components/TestsDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Benchmarks & Tests — SMF Clearinghouse",
  description: "Head-to-head agent tests with methodology, scores, and honest notes.",
};

export default function TestsPage() {
  const items = getAllItems("tests");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <TestsDirectoryClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
