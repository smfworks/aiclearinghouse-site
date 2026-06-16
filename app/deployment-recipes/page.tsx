import { getAllItems, getSectionTitle } from "@/lib/marketplace/loader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DeploymentRecipesClient from "@/components/DeploymentRecipesClient";

export const metadata = {
  title: "Deployment Recipes — SMF Clearinghouse",
  description: "Copy-paste recipes for Ollama, OpenClaw, Cline, Open WebUI, Hermes, Microsoft Scout, and more.",
};

const VIDEO_TWEET_URL = "https://x.com/MichaelGannotti/status/2066926652773314798";

export default function DeploymentRecipesPage() {
  const items = getAllItems("deployment-recipes");
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <DeploymentRecipesClient items={items} videoTweetUrl={VIDEO_TWEET_URL} />
      </main>
      <Footer />
    </div>
  );
}
