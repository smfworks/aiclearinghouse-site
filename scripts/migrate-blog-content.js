#!/usr/bin/env node
/**
 * Migration script: SMF Works technical blog content → SMF Clearinghouse /blog
 *
 * Usage:
 *   node scripts/migrate-blog-content.js
 *
 * Expects:
 *   SOURCE_DIR  = path to smfworks-site content root
 *   TARGET_DIR  = path to clearinghouse-site content/blog
 *   IMAGES_DIR  = path to clearinghouse-site public/images/blog
 *
 * The script:
 *   1. Copies all blog/ posts
 *   2. Copies terminal/, drj/, jeffs-journal/ posts
 *   3. Tags them with author + series
 *   4. Copies referenced images into public/images/blog
 *   5. Leaves source files untouched
 */

const fs = require("fs");
const path = require("path");

const SOURCE_DIR = "/home/mikesai3/.openclaw/agents/aiona/workspace/smfworks-site";
const TARGET_DIR = "/home/mikesai3/.openclaw/agents/pamela/workspace/clearinghouse-site/content/blog";
const PUBLIC_TARGET = "/home/mikesai3/.openclaw/agents/pamela/workspace/clearinghouse-site/public/images/blog";
const BLOG_PUBLIC = "/home/mikesai3/.openclaw/agents/pamela/workspace/clearinghouse-site/public/blog";

const SOURCE_CONTENT = path.join(SOURCE_DIR, "content");
const SOURCE_PUBLIC = path.join(SOURCE_DIR, "public");

const AUTHORS = {
  "Aiona Edge": { key: "aiona", series: "clearinghouse" },
  "Jeff (AI)": { key: "jeff", series: "jeff" },
  "Dr J": { key: "drj", series: "drj" },
  Liam: { key: "liam", series: "liam" },
  Gabriel: { key: "gabriel", series: "clearinghouse" },
  "Morgan Lockridge": { key: "morgan", series: "clearinghouse" },
  Pamela: { key: "pamela", series: "clearinghouse" },
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const lines = match[1].split("\n");
  const data = {};
  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (trimmed.startsWith("---") || trimmed === "") continue;
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;
    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key === "categories" || key === "tags") {
      try {
        data[key] = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        data[key] = value
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((s) => s.trim().replace(/^["']/, "").replace(/["']$/, ""))
          .filter(Boolean);
      }
    } else if (key === "readTime") {
      data[key] = isNaN(Number(value)) ? value : Number(value);
    } else {
      data[key] = value;
    }
  }
  return { data, body: match[2].trimStart() };
}

function stringifyFrontmatter(data) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(", ")}]`);
    } else if (typeof value === "number") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${String(value).replace(/"/g, '\\"')}"`);
    }
  }
  lines.push("---");
  return lines.join("\n") + "\n";
}

function inferAuthorAndSeries(categories, author) {
  if (author && AUTHORS[author]) {
    return AUTHORS[author];
  }
  const cats = categories.map((c) => c.toLowerCase());
  if (cats.some((c) => c.includes("liam"))) return { key: "liam", series: "liam" };
  if (cats.some((c) => c.includes("terminal"))) return { key: "aiona", series: "terminal" };
  if (cats.some((c) => c.includes("drj") || c.includes("diagnostic"))) return { key: "drj", series: "drj" };
  if (cats.some((c) => c.includes("jeff") || c.includes("windows") || c.includes("microsoft"))) {
    return { key: "jeff", series: "jeff" };
  }
  return { key: "aiona", series: "clearinghouse" };
}

function seriesFromSourceDir(sourceDir) {
  if (sourceDir.includes("the-terminal")) return { key: "aiona", series: "terminal" };
  if (sourceDir.includes("drj")) return { key: "drj", series: "drj" };
  if (sourceDir.includes("jeffs-journal")) return { key: "jeff", series: "jeff" };
  return null;
}

function findImageSource(imagePath) {
  const candidates = [
    path.join(SOURCE_PUBLIC, imagePath),
    path.join(SOURCE_PUBLIC, imagePath.replace(/^\//, "")),
    path.join(SOURCE_PUBLIC, "images", "blog", path.basename(imagePath)),
    path.join(SOURCE_PUBLIC, "blog", path.basename(imagePath)),
    path.join(SOURCE_DIR, imagePath.replace(/^\//, "")),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function copyImage(imagePath, slug) {
  if (!imagePath) return undefined;
  const source = findImageSource(imagePath);
  if (!source) return imagePath; // leave as-is, maybe external URL

  const ext = path.extname(source) || ".png";
  const destName = `${slug}${ext}`;
  const dest = path.join(PUBLIC_TARGET, destName);
  ensureDir(PUBLIC_TARGET);
  fs.copyFileSync(source, dest);
  return `/images/blog/${destName}`;
}

function migrateFile(sourceFile, sourceDir) {
  const slug = path.basename(sourceFile, ".md");
  const raw = fs.readFileSync(sourceFile, "utf-8");
  const { data, body } = parseFrontmatter(raw);

  const originalUrl = data.originalUrl || data.original_url || `https://smfworks.com/${path.basename(sourceDir)}/${slug}`;
  const canonicalUrl = `https://www.smfclearinghouse.com/blog/${slug}`;

  const authorMeta = inferAuthorAndSeries(data.categories || [], data.author);
  const dirMeta = seriesFromSourceDir(sourceDir);
  const finalAuthor = data.author
    ? data.author
    : dirMeta
      ? getAuthorName(dirMeta.key)
      : getAuthorName(authorMeta.key);
  const finalSeries = dirMeta ? dirMeta.series : authorMeta.series;

  const newData = {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    author: finalAuthor,
    authorKey: data.author ? (AUTHORS[data.author]?.key || data.author.toLowerCase().replace(/[^a-z0-9]/g, "-")) : authorMeta.key,
    series: finalSeries,
    categories: data.categories || [],
    tags: data.tags || [],
    readTime: typeof data.readTime === "number" ? data.readTime : 0,
    image: copyImage(data.image, slug),
    originalUrl,
    canonicalUrl,
  };

  // Strip categories that are now series labels
  newData.categories = newData.categories.filter(
    (c) => !["Liam's Landing", "The Terminal", "SMF Blog", "SMF AI Weekly"].includes(c)
  );

  const targetFile = path.join(TARGET_DIR, `${slug}.md`);
  ensureDir(TARGET_DIR);
  fs.writeFileSync(targetFile, stringifyFrontmatter(newData) + body);
  return { slug, source: path.basename(sourceDir), author: finalAuthor, series: finalSeries };
}

function getAuthorName(key) {
  const map = {
    aiona: "Aiona Edge",
    liam: "Liam Hermes",
    jeff: "Jeff",
    drj: "Dr. J",
    gabriel: "Gabriel",
    morgan: "Morgan Lockridge",
    pamela: "Pamela Flannery",
  };
  return map[key] || key;
}

function main() {
  ensureDir(TARGET_DIR);
  ensureDir(PUBLIC_TARGET);

  const results = [];
  const sourceDirs = [
    { dir: "blog", migrateAll: true },
    { dir: "the-terminal", migrateAll: true },
    { dir: "drj", migrateAll: true },
    { dir: "jeffs-journal", migrateAll: true },
  ];

  for (const { dir, migrateAll } of sourceDirs) {
    const fullDir = path.join(SOURCE_CONTENT, dir);
    if (!fs.existsSync(fullDir)) continue;

    const files = fs
      .readdirSync(fullDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => path.join(fullDir, f));

    for (const file of files) {
      try {
        const result = migrateFile(file, fullDir);
        results.push({ ...result, dir });
      } catch (err) {
        console.error(`Failed to migrate ${file}:`, err.message);
      }
    }
  }

  // Summary
  const bySeries = {};
  const byAuthor = {};
  for (const r of results) {
    bySeries[r.series] = (bySeries[r.series] || 0) + 1;
    byAuthor[r.author] = (byAuthor[r.author] || 0) + 1;
  }

  console.log("\n=== Migration Summary ===");
  console.log(`Total posts migrated: ${results.length}`);
  console.log("\nBy series:");
  for (const [series, count] of Object.entries(bySeries).sort()) {
    console.log(`  ${series}: ${count}`);
  }
  console.log("\nBy author:");
  for (const [author, count] of Object.entries(byAuthor).sort()) {
    console.log(`  ${author}: ${count}`);
  }

  const summaryPath = path.join(TARGET_DIR, "..", "..", "strategy", "migration-summary.json");
  ensureDir(path.dirname(summaryPath));
  fs.writeFileSync(summaryPath, JSON.stringify({ total: results.length, bySeries, byAuthor, posts: results }, null, 2));
  console.log(`\nSummary written to ${summaryPath}`);
}

main();
