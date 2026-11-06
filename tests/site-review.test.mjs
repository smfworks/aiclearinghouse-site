import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { register } from "node:module";
import { describe, test } from "node:test";
register("./resolve-ts.mjs", import.meta.url);

const { loadHomeDirectory } = await import("../lib/home-directory.ts");
const { getAllCards, getAgentList } = await import("../lib/marketplace/loader.ts");
const { buildRssFeed } = await import("../lib/feed.ts");
const { markdownToHtml } = await import("../lib/markdown.ts");
const { demoteLeadingH1 } = await import("../lib/seo.ts");
const { contrastRatio, readableTextOn } = await import("../lib/contrast.ts");
const { sitePath } = await import("../lib/paths.ts");
const { stableDateLabel } = await import("../lib/time.ts");

describe("homepage card payload", () => {
  test("omits article bodies and stays well under the old multi-megabyte document", () => {
    const data = loadHomeDirectory();
    const json = JSON.stringify(data);
    assert.ok(Buffer.byteLength(json) < 1_600_000, `payload ${Buffer.byteLength(json)}`);
    for (const items of Object.values(data.genericItems)) {
      for (const item of items) {
        assert.equal("content" in item, false);
        assert.equal(typeof item.title, "string");
        assert.equal(typeof item.slug, "string");
        assert.ok(Array.isArray(item.tags));
      }
    }
    for (const agent of data.agents) {
      assert.equal("description" in agent, false);
    }
    const blog = data.genericItems.blog || [];
    assert.ok(blog.length > 100);
    const guide = getAllCards("guides").find((item) => item.slug === "choosing-your-first-agent");
    assert.ok(guide);
    assert.equal("content" in guide, false);
    assert.ok(guide.excerpt.length > 0);
  });

  test("agent list cards keep comparison fields and drop the markdown description", () => {
    const agents = getAgentList();
    assert.ok(agents.length > 0);
    assert.equal("description" in agents[0], false);
    assert.equal(typeof agents[0].name, "string");
    assert.ok(Array.isArray(agents[0].features));
  });
});

describe("accessibility helpers", () => {
  test("gives checklist checkboxes an accessible name", () => {
    const html = markdownToHtml("- [ ] **Day 1:** Install and complete the official tutorial\n");
    assert.match(html, /type="checkbox"/);
    assert.match(html, /aria-label="Day 1: Install and complete the official tutorial"/);
  });

  test("uses dark text on the Perplexity button color", () => {
    const background = "#e85d4e";
    assert.ok(contrastRatio("#ffffff", background) < 4.5);
    const text = readableTextOn(background);
    assert.equal(text, "#050507");
    assert.ok(contrastRatio(text, background) >= 4.5);
  });
});

describe("single heading and stable dates", () => {
  test("demotes a leading markdown H1", () => {
    assert.equal(demoteLeadingH1("# v0 Changelog\n\n## Recent highlights\n"), "## v0 Changelog\n\n## Recent highlights\n");
    assert.equal(demoteLeadingH1("## Already secondary\n"), "## Already secondary\n");
  });

  test("formats a UTC calendar date without a relative phrase", () => {
    assert.equal(stableDateLabel("2026-11-03T05:51:06Z"), "Nov 3");
  });
});

describe("rss and trailing slashes", () => {
  test("builds an RSS channel from real posts", () => {
    const xml = buildRssFeed();
    assert.match(xml, /<rss version="2.0">/);
    assert.match(xml, /<title>SMF Clearinghouse<\/title>/);
    assert.match(xml, /<link>https:\/\/www\.smfclearinghouse\.com\/blog\/[^<]+\/<\/link>/);
    assert.equal(xml.includes("<content>"), false);
  });

  test("adds a trailing slash before a query and leaves files alone", () => {
    assert.equal(sitePath("/blog"), "/blog/");
    assert.equal(sitePath("/agents/compare?ids=a,b"), "/agents/compare/?ids=a,b");
    assert.equal(sitePath("/feed.xml"), "/feed.xml");
    assert.equal(sitePath("/"), "/");
  });
});

describe("icons", () => {
  test("ships an apple touch icon and manifest icons", () => {
    for (const file of ["public/apple-touch-icon.png", "public/icons/icon-192.png", "public/icons/icon-512.png"]) {
      const bytes = fs.readFileSync(path.join(process.cwd(), file));
      assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    }
  });
});
