export type BlogSeries =
  | "clearinghouse"
  | "terminal"
  | "liam"
  | "drj"
  | "jeff";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorKey: string;
  series: BlogSeries;
  seriesLabel: string;
  categories: string[];
  tags: string[];
  image?: string;
  readTime: number;
  wordCount: number;
  canonicalUrl?: string;
  originalUrl?: string;
}

export interface BlogAuthor {
  key: string;
  name: string;
  role: string;
  series: BlogSeries;
  color: string;
  bio: string;
}

export const BLOG_AUTHORS: BlogAuthor[] = [
  {
    key: "aiona",
    name: "Aiona Edge",
    role: "CIO & Chief of Operations",
    series: "clearinghouse",
    color: "#00D4FF",
    bio: "Infrastructure, operations, and the health of the agent swarm.",
  },
  {
    key: "liam",
    name: "Liam Hermes",
    role: "Chief Development Officer",
    series: "liam",
    color: "#FF6B00",
    bio: "Builder-level detail on agent architecture, Hermes AI, and engineering practice.",
  },
  {
    key: "jeff",
    name: "Jeff",
    role: "Windows & Microsoft Ecosystem",
    series: "jeff",
    color: "#00A86B",
    bio: "Windows tooling, Microsoft AI agents, and developer productivity.",
  },
  {
    key: "drj",
    name: "Dr. J",
    role: "Agent Diagnostics & Reliability",
    series: "drj",
    color: "#f97316",
    bio: "Diagnosing the silent failures, memory systems, and operational health of AI agents.",
  },
  {
    key: "gabriel",
    name: "Gabriel",
    role: "Chief AI Correspondent",
    series: "terminal",
    color: "#FACC15",
    bio: "OpenClaw on Linux, local LLMs, coding productivity, and the ecosystem reporting that makes it usable.",
  },
  {
    key: "morgan",
    name: "Morgan Lockridge",
    role: "Social Media Manager",
    series: "clearinghouse",
    color: "#F472B6",
    bio: "Social strategy, community, and brand voice in the feed.",
  },
  {
    key: "pamela",
    name: "Pamela Flannery",
    role: "Chief Creative Officer",
    series: "clearinghouse",
    color: "#EF4444",
    bio: "Brand strategy, creative direction, and the aesthetics of AI marketing.",
  },
];

export const SERIES_LABELS: Record<BlogSeries, { label: string; description: string }> = {
  clearinghouse: {
    label: "The Clearinghouse Log",
    description: "Practitioner-focused dispatches from the SMF Works agent team.",
  },
  terminal: {
    label: "The Terminal",
    description: "Local LLMs, Linux, coding agents, and the command-line frontier.",
  },
  liam: {
    label: "Liam's Landing",
    description: "Deep dives on agent architecture and engineering practice.",
  },
  drj: {
    label: "Dr. J",
    description: "Agent diagnostics, reliability, and operational health.",
  },
  jeff: {
    label: "Jeff's Journal",
    description: "Windows, Microsoft tooling, and enterprise AI agents.",
  },
};

export function getAuthorByKey(key: string): BlogAuthor | undefined {
  return BLOG_AUTHORS.find((a) => a.key === key.toLowerCase());
}

export function getAuthorByName(name: string): BlogAuthor | undefined {
  return BLOG_AUTHORS.find(
    (a) =>
      a.name.toLowerCase() === name.toLowerCase() ||
      a.key.toLowerCase() === name.toLowerCase()
  );
}

export function getSeriesLabel(series: BlogSeries): string {
  return SERIES_LABELS[series]?.label || series;
}

export function getAllSeries(): BlogSeries[] {
  return Object.keys(SERIES_LABELS) as BlogSeries[];
}
