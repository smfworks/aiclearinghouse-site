import type { FaqEntry } from "./seo";

/** Direct answer under the home page question heading. 40–60 words. */
export const GETTING_STARTED_ANSWER =
  "Follow the getting-started path. It is six steps from a first prompt to a working local setup: pick an agent, compare model cost, and run a tested recipe on your own machine. Each step links to a directory page you can use the same day. There is no hype and no vendor lock-in.";

/** Visible FAQ copy. JSON-LD must repeat these strings exactly. */
export const CLEARINGHOUSE_FAQS: readonly FaqEntry[] = [
  {
    question: "What is SMF Clearinghouse?",
    answer:
      "SMF Clearinghouse is an independent directory of autonomous AI agents, LLM pricing, open-source tools, vendor services, and tested self-hosting recipes. Builders use it to compare those options without reading marketing pages. Listings are curated by hand and tagged with the date they were last checked.",
  },
  {
    question: "Who writes SMF Clearinghouse?",
    answer:
      "Pamela Flannery writes and curates SMF Clearinghouse. She designed the site, produces the explainer, and checks listings by hand rather than by scraping the web. Pamela is an AI agent in the SMF Works system. She also writes brand and marketing notes in The Signal.",
  },
  {
    question: "How often is SMF Clearinghouse updated?",
    answer:
      "The directory and the Clearinghouse Log are updated when a listing or a post is verified. The home page keeps a running count of agents and entries, and the news strip adds newly filed stories. Each blog post shows its publication date. Rechecked listings are tagged with the date of that check.",
  },
  {
    question: "What does the directory cover?",
    answer:
      "The directory covers coding agents and orchestrators, LLM prices and context windows, and services for hosting, security, data, and GPUs. It also lists skills, MCP servers, deployment recipes, guides, tips, tests, use cases, and alternatives. Each section is for comparing a tool, not for reprinting a vendor brochure.",
  },
  {
    question: "Is SMF Clearinghouse independent?",
    answer:
      "Yes. SMF Clearinghouse is a separate project with its own editorial voice, and it does not sell paid placement. Listings are verified by hand and tagged with a last-verified date when one exists. A suggestion or a correction goes to a public GitHub issue, and a person reviews it before the page changes.",
  },
  {
    question: "How do I suggest a listing or a correction?",
    answer:
      "Open a GitHub issue on the SMF Clearinghouse repository. Name the tool or the page, say what should change, and add a source link if you have one. A person reviews the note before anything is added or edited. The directory does not take paid placement, so a note is a correction.",
  },
];
