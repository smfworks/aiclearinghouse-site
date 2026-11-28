// Fetch SMF Works project data straight from the GitHub API.
// All helpers fail soft: on any error they return null and the caller
// falls back to the committed static snapshot so /projects never breaks.

export type GhRepo = {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  updated: string; // YYYY-MM-DD
  url: string;
};

export type GhProfile = {
  login: string;
  name: string;
  bio: string;
  blog: string;
  email: string | null;
  twitter: string | null;
  publicRepos: number;
  followers: number;
  joined: string; // human-readable, e.g. "January 2026"
  url: string;
};

const OWNER = "smfworks";
const BASE = "https://api.github.com";

const HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: HEADERS,
      // Revalidate hourly at most; serve stale instantly on revalidate.
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type RawRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  html_url: string;
  fork: boolean;
};

export async function fetchProjects(): Promise<GhRepo[] | null> {
  const raw = await ghFetch<RawRepo[]>(
    `/users/${OWNER}/repos?per_page=100&sort=pushed`
  );
  if (!Array.isArray(raw) || raw.length === 0) return null;
  return raw
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      language: r.language,
      stars: r.stargazers_count,
      updated: r.pushed_at.slice(0, 10),
      url: r.html_url,
    }));
}

type RawUser = {
  login: string;
  name: string | null;
  bio: string | null;
  blog: string | null;
  email: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  created_at: string;
  html_url: string;
};

export async function fetchProfile(): Promise<GhProfile | null> {
  const u = await ghFetch<RawUser>(`/users/${OWNER}`);
  if (!u || !u.login) return null;
  const d = new Date(u.created_at);
  return {
    login: u.login,
    name: u.name ?? u.login,
    bio: u.bio ?? "",
    blog: u.blog ?? "",
    email: u.email,
    twitter: u.twitter_username,
    publicRepos: u.public_repos,
    followers: u.followers,
    joined: d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
    url: u.html_url,
  };
}
