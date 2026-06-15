import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllItems } from "@/lib/marketplace/loader";
import { getSectionTitle } from "@/lib/marketplace/loader";
import SectionDirectoryClient from "@/components/SectionDirectoryClient";

export const metadata = {
  title: "Deployment Recipes — SMF Clearinghouse",
  description: "Copy-paste recipes for Ollama, OpenClaw, Cline, Open WebUI, and more.",
};

export default function DeploymentRecipesPage() {
  const items = getAllItems("deployment-recipes");
  const title = getSectionTitle("deployment-recipes");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <SectionDirectoryClient
          items={items}
          section="deployment-recipes"
          title={title}
          description="Tested copy-paste recipes for setting up agents and LLMs on your own hardware or cloud."
        />
      </main>
      <Footer />
    </div>
  );
}
