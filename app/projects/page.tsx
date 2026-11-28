import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  FolderGit2,
  GitBranch,
  Globe,
  Mail,
  Star,
  Users,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { fetchProfile, fetchProjects, type GhProfile, type GhRepo } from "@/lib/github";

export const metadata: Metadata = {
  title: "SMF Projects | SMF Clearinghouse",
  description:
    "SMF Works delivers HighTech-powered content and workflow solutions. Serious expertise. Genuine craftsmanship. No corporate fluff. Every open-source project from the SMF Works workshop on GitHub.",
  alternates: { canonical: "https://www.smfclearinghouse.com/projects" },
  openGraph: {
    title: "SMF Projects",
    description:
      "HighTech-powered content and workflow solutions from SMF Works. Serious expertise. Genuine craftsmanship. No corporate fluff.",
    url: "https://www.smfclearinghouse.com/projects",
    siteName: "SMF Clearinghouse",
    type: "website",
  },
};

// Fallback snapshot of https://github.com/smfworks (GitHub API, 2026-11-28).
// Used only when a live API fetch fails, so the page never breaks.
const PROFILE: GhProfile = {
  login: "smfworks",
  name: "SMF Works",
  bio: "SMF Works delivers HighTech-powered content and workflow solutions. Serious expertise. Genuine craftsmanship. No corporate fluff",
  blog: "https://smfworks.com/",
  email: "michael@smfworks.com",
  twitter: "michaelgannotti",
  publicRepos: 133,
  followers: 51,
  joined: "January 2026",
  url: "https://github.com/smfworks",
};

type Project = {
  name: string;
  description: string;
  language?: string;
  stars: number;
  updated: string; // YYYY-MM-DD
};

const PROJECTS: Project[] = [
  { name: "aiclearinghouse-site", description: "AI Clearinghouse website", language: "HTML", stars: 3, updated: "2026-11-28" },
  { name: "hermes-agent", description: "The agent that grows with you", language: "Python", stars: 0, updated: "2026-11-27" },
  { name: "grok-video-studio", description: "Scripts, tests and installer for the Grok Bot Video Studio template: Grok Imagine video pipeline, xAI API adapter, local Piper narration, captions, QA. MIT.", language: "Python", stars: 1, updated: "2026-11-27" },
  { name: "grok-bot-templates", description: "Published Grok Bot templates by Michael Gannotti / SMF Works.", stars: 18, updated: "2026-11-27" },
  { name: "smf-open-characters", description: "SMF Open Character Library: original, fully fictional, photoreal characters with full kits (refs, prompts, voice, story, proof clip). CC0, credit optional.", stars: 2, updated: "2026-11-25" },
  { name: "NemoKnowledgebase", description: "Measured model tests from SMF Works. Cold Iron (formerly Official A) is the ranked 157, thinking off. Methods, suites to run, and every published Clearinghouse test, newest first.", language: "Python", stars: 1, updated: "2026-11-25" },
  { name: "trajectory-arena", description: "Trajectory Arena is an interactive visualizer and evaluation arena for agentic coding sessions.", language: "TypeScript", stars: 0, updated: "2026-11-22" },
  { name: "AionaKnowledgebase", description: "Measured model tests by Aiona Edge. One-shots, Decisions payloads, and craft pages. Every Clearinghouse test she posted, newest first.", stars: 0, updated: "2026-11-21" },
  { name: "smf-works-books", description: "A growing collection of free books from SMF Works. We explore how humans and AI can actually work together, and we write the practical guides that put that power in the hands of everyday people.", stars: 8, updated: "2026-11-20" },
  { name: "hermes-agent-templates", description: "Hermes Agent profile templates by SMF Works. MIT.", language: "Python", stars: 5, updated: "2026-11-20" },
  { name: "localrouter", description: "Fast & opinionated local AI routing: one MCP server that loads local image and video models on demand on your own GPU box (DGX Spark first).", stars: 1, updated: "2026-11-19" },
  { name: "ROG-Flow-Z13-GZ302EA-Omarchy", description: "Set up Omarchy Linux on the ASUS ROG Flow Z13 (GZ302EA).", language: "Shell", stars: 0, updated: "2026-11-18" },
  { name: "smfworks-site", description: "Official SMF Works website - Next.js application showcasing AI automation services.", language: "TypeScript", stars: 1, updated: "2026-11-15" },
  { name: "smf-forgewright", description: "Forgewright tooling from SMF Works.", language: "Python", stars: 5, updated: "2026-11-15" },
  { name: "voice-enabling-devices", description: "How-to and sanitized reference code for turning a rooted 2nd-gen Echo Dot into a push-to-talk realtime voice line to an AI agent. Post-root only; does not include rooting steps.", language: "Java", stars: 9, updated: "2026-11-13" },
  { name: "agent-llm-wiki-vault", description: "Agent LLM Wiki Vault: a step-by-step recipe for giving local AI agents (Hermes, OpenClaw and others) a persistent markdown wiki vault. By SMF Works.", language: "Python", stars: 1, updated: "2026-11-11" },
  { name: "smf-bench", description: "Standardized benchmark testing for models.", language: "Python", stars: 4, updated: "2026-11-08" },
  { name: "wisdomforge", description: "WisdomForge — a parent-operated academy for education in the age of AI. Four age bands, ten subjects, autonomous AI and critical thinking as the spine.", language: "TypeScript", stars: 0, updated: "2026-11-06" },
  { name: "praxis-prime", description: "Praxis Prime: an open-source, local-first autonomous AI agent for Linux (Ubuntu + Omarchy) with built-in compliance dials, agent swarms, and a local decision engine. MIT.", language: "Python", stars: 4, updated: "2026-10-18" },
  { name: "wisdomforge-mcp", description: "Read-only MCP server for SMF WisdomForge content: booklets, audio, lessons, age bands. Built for Grok Bot and Cursor.", language: "TypeScript", stars: 0, updated: "2026-10-15" },
  { name: "grok-studio", description: "Grok Studio tooling from SMF Works.", language: "Python", stars: 1, updated: "2026-10-14" },
  { name: "smf-video-recipes", description: "Recipes for repeatable video generation. First recipe: MiniMax H3 on DGX Spark with ComfyUI.", stars: 0, updated: "2026-10-12" },
  { name: "strix-halo-image-recipes", description: "Measured ComfyUI image recipes for AMD Strix Halo on Omarchy.", stars: 1, updated: "2026-10-11" },
  { name: "prime-directive", description: "Two Primes. One rule: nothing merges without the human's yes. The playbook for a two-bot coding team in Grok Bot: Builder Prime builds, Gatekeeper Prime reviews, you decide.", stars: 1, updated: "2026-10-09" },
  { name: "hermes-opsec-agent", description: "Bourne — defensive personal OPSEC advisor packaged as a Hermes Agent profile template. MIT. Not an official Nous Research package.", language: "Shell", stars: 4, updated: "2026-10-05" },
  { name: "smf-hermes-chat-hub", description: "A clean chat hub that can be reached via Tailscale so you can easily chat with your Hermes AI.", language: "HTML", stars: 2, updated: "2026-10-04" },
  { name: "smf-clawpost", description: "Social engine for posting content to social media sites.", language: "TypeScript", stars: 1, updated: "2026-10-04" },
  { name: "smf-llm-test", description: "Testing harness and documentation.", language: "Python", stars: 1, updated: "2026-10-04" },
];

const HIGHLIGHTS = new Set([
  "grok-bot-templates",
  "smf-works-books",
  "hermes-agent-templates",
  "smf-forgewright",
  "voice-enabling-devices",
  "praxis-prime",
]);

const LANG_STYLES: Record<string, string> = {
  Python: "bg-yellow-500",
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  HTML: "bg-orange-500",
  Shell: "bg-green-500",
  Java: "bg-red-500",
  "C#": "bg-purple-500",
};

function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function ProjectsPage() {
  // Live from the GitHub API (ISR cache, revalidate hourly); static snapshot
  // below is the fallback if the API is unreachable or rate-limited.
  const [liveProfile, liveProjects] = await Promise.all([
    fetchProfile(),
    fetchProjects(),
  ]);
  const profile = liveProfile ?? PROFILE;
  const allProjects: (GhRepo | (typeof PROJECTS)[number])[] =
    liveProjects ?? PROJECTS;
  const known = (p: GhRepo | (typeof PROJECTS)[number]) =>
    HIGHLIGHTS.has(p.name);
  const highlights = allProjects.filter(known);
  const rest = allProjects.filter((p) => !known(p));
  const repoLink = (p: GhRepo | (typeof PROJECTS)[number]) =>
    "url" in p ? p.url : `https://github.com/smfworks/${p.name}`;
  const hasStars = (p: GhRepo | (typeof PROJECTS)[number]): p is GhRepo =>
    typeof (p as GhRepo).stars === "number";

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 bg-canvas">
        {/* Org header — mirrors github.com/smfworks */}
        <section className="bg-rd-projects relative overflow-hidden border-b border-hairline">
          <div className="bg-rd-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-px w-6 bg-cyan" aria-hidden="true" />
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                  Open-Source R&amp;D
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded-full border border-hairline-strong bg-elevated/80 px-3.5 py-1 text-foreground-secondary">
                  {profile.publicRepos} public repos
                </span>
                <span className="rounded-full border border-hairline-strong bg-elevated/80 px-3.5 py-1 text-foreground-secondary">
                  {profile.followers} followers
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-accent/40 bg-gradient-to-br from-elevated via-panel to-canvas font-display text-3xl font-semibold text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_32px_-10px_var(--accent-glow)]">
                S
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="font-display text-4xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl">
                    {profile.name}
                  </h1>
                  <span className="rounded-md border border-hairline bg-elevated/80 px-2.5 py-0.5 font-mono text-xs text-foreground-tertiary">
                    @{profile.login}
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
                  {profile.bio}
                </p>

                <dl className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-foreground-secondary">
                  <div className="inline-flex items-center gap-2">
                    <dt className="sr-only">Website</dt>
                    <Globe className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    <dd>
                      <a
                        href={profile.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent transition-colors hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                      >
                        {profile.blog.replace("https://", "")}
                      </a>
                    </dd>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <dt className="sr-only">X</dt>
                    <ArrowUpRight className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
                    <dd>
                      <a
                        href={`https://x.com/${profile.twitter ?? ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent transition-colors hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                      >
                        {profile.twitter ? `@${profile.twitter}` : null}
                      </a>
                    </dd>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <dt className="sr-only">Email</dt>
                    <Mail className="h-3.5 w-3.5 text-foreground-tertiary" aria-hidden="true" />
                    <dd>
                      <a
                        href={`mailto:${profile.email ?? ""}`}
                        className="text-accent transition-colors hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                      >
                        {profile.email}
                      </a>
                    </dd>
                  </div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground-tertiary">
                    <dt className="sr-only">Followers</dt>
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    <dd>{profile.followers} followers</dd>
                  </div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground-tertiary">
                    <dt className="sr-only">Joined</dt>
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <dd>Joined {profile.joined}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="hairline-signal-subtle h-px w-full" aria-hidden="true" />
        </section>

        {/* Featured repositories */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-5 bg-accent" aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Featured projects
              </h2>
            </div>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-hairline-strong bg-elevated/75 px-4 py-1.5 font-mono text-xs font-medium text-accent transition-all duration-200 hover:border-accent/55 hover:bg-elevated hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>View all {profile.publicRepos} repositories on GitHub</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((p) => (
              <a
                key={p.name}
                href={repoLink(p)}
                target="_blank"
                rel="noopener noreferrer"
                className="card-rd group relative flex flex-col overflow-hidden rounded-2xl border border-hairline p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/0 via-accent/70 to-cyan/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent transition-colors group-hover:border-accent/50 group-hover:bg-accent/18">
                      <FolderGit2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h3 className="truncate font-mono text-[0.95rem] font-semibold text-foreground transition-colors group-hover:text-accent-hover">
                      {p.name}
                    </h3>
                  </div>

                  {hasStars(p) && p.stars > 0 && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 font-mono text-xs font-medium text-accent">
                      <Star className="h-3 w-3 fill-accent/30" aria-hidden="true" />
                      {p.stars}
                    </span>
                  )}
                </div>

                <p className="mt-3.5 flex-1 text-sm leading-relaxed text-foreground-secondary">
                  {p.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-hairline/75 pt-4 font-mono text-xs text-foreground-tertiary">
                  <div className="flex items-center gap-3">
                    {p.language && (
                      <span className="inline-flex items-center gap-1.5 text-foreground-secondary">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${LANG_STYLES[p.language] ?? "bg-gray-400"}`}
                          aria-hidden="true"
                        />
                        {p.language}
                      </span>
                    )}
                    <span>Updated {fmtDate(p.updated)}</span>
                  </div>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-foreground-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* All projects */}
        <section className="border-t border-hairline bg-panel/35">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-5 bg-cyan" aria-hidden="true" />
                <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  More projects
                </h2>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-foreground-tertiary">
                {rest.length} additional repositories
              </span>
            </div>

            <ul className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {rest.map((p) => (
                <li key={p.name}>
                  <a
                    href={repoLink(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-rd-teal group flex h-full flex-col rounded-xl border border-hairline/85 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <div className="flex items-center gap-2.5">
                      <GitBranch
                        className="h-3.5 w-3.5 shrink-0 text-cyan/80 transition-colors group-hover:text-cyan"
                        aria-hidden="true"
                      />
                      <span className="truncate font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-cyan">
                        {p.name}
                      </span>
                      {hasStars(p) && p.stars > 0 && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline-strong bg-elevated/80 px-2 py-0.5 font-mono text-[11px] text-foreground-secondary">
                          <Star className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
                          {p.stars}
                        </span>
                      )}
                      {p.language && (
                        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-foreground-secondary">
                          <span
                            className={`h-2 w-2 rounded-full ${LANG_STYLES[p.language] ?? "bg-gray-400"}`}
                            aria-hidden="true"
                          />
                          {p.language}
                        </span>
                      )}
                    </div>

                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-foreground-secondary">
                      {p.description}
                    </p>

                    <div className="mt-3.5 flex items-center justify-between font-mono text-[11px] text-foreground-tertiary">
                      <span>Updated {fmtDate(p.updated)}</span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 opacity-60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="card-rd mt-12 rounded-2xl border border-hairline px-6 py-5 text-sm leading-relaxed text-foreground-secondary">
              New here? Start with{" "}
              <Link
                href="/blog"
                className="font-medium text-accent transition-colors hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                the blog
              </Link>{" "}
              for the stories behind these builds, or visit{" "}
              <a
                href="https://smfworks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent transition-colors hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                SMF Works
              </a>{" "}
              for what we can build with you.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
