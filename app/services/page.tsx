import { getAllItems } from "@/lib/marketplace/loader";
import ServicesDirectoryClient from "@/components/ServicesDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Services — SMF Clearinghouse",
  description: "Curated infrastructure, data, security, and API services that power production AI agents.",
};

export default function ServicesPage() {
  const items = getAllItems("services");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <ServicesDirectoryClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
