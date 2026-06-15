import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: getSectionTitle("skills") + " — SMF Clearinghouse",
  description: "50+ reusable skills, MCP servers, and agent add-ons for Hermes, OpenClaw, and compatible agents.",
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
          description="50+ reusable skills, MCP servers, and add-ons for Hermes Agent, OpenClaw, and compatible autonomous agents. Each card links to a detailed install guide with dependencies and source."
        />
      </main>
      <Footer />
    </div>
  );
}
