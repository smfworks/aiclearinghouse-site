import assert from "node:assert/strict";
import { register } from "node:module";
import { describe, test } from "node:test";
register("./resolve-ts.mjs", import.meta.url);

const { CLEARINGHOUSE_FAQS, GETTING_STARTED_ANSWER } = await import("../lib/clearinghouse-faq.ts");
const { blogPostJsonLd, selectRelatedPosts, truncateMetaDescription, wordCount } = await import(
  "../lib/seo.ts"
);
const { ORG_NAME, siteJsonLd } = await import("../lib/site.ts");
const { getBlogCatalog, getBlogPostBySlug } = await import("../lib/blog/loader.ts");

const LONG_EXCERPT =
  "A clipboard that is only a picture is /paste in the CLI. The badge above the input is that picture. A new picture is text, hermes tools, and image_gen. In Desktop, drop the file on the chat.";

describe("meta descriptions", () => {
  test("leaves short text unchanged and caps long text at 160 characters", () => {
    assert.equal(truncateMetaDescription("Short description."), "Short description.");
    assert.ok(LONG_EXCERPT.length > 160);
    const truncated = truncateMetaDescription(LONG_EXCERPT);
    assert.ok(truncated.length <= 160, `length ${truncated.length}`);
    assert.ok(truncated.endsWith("…"));
    assert.equal(truncated.includes("  "), false);
  });
});

describe("BlogPosting JSON-LD", () => {
  test("emits BlogPosting and Home > Blog > post breadcrumbs", () => {
    const data = blogPostJsonLd({
      slug: "2026-10-31-paste-the-picture-leave-the-draw",
      title: "Paste the Picture. Leave the Draw.",
      excerpt: LONG_EXCERPT,
      date: "2026-10-31",
      author: "Jasmine Naderi",
      image: "/images/blog/2026-10-31-paste-the-picture-leave-the-draw.svg",
      canonicalUrl:
        "https://www.smfclearinghouse.com/blog/2026-10-31-paste-the-picture-leave-the-draw",
    });

    const posting = data["@graph"].find((node) => node["@type"] === "BlogPosting");
    const crumbs = data["@graph"].find((node) => node["@type"] === "BreadcrumbList");

    assert.equal(posting.headline, "Paste the Picture. Leave the Draw.");
    assert.ok(posting.description.length <= 160);
    assert.equal(
      posting.image,
      "https://www.smfclearinghouse.com/images/blog/2026-10-31-paste-the-picture-leave-the-draw.svg",
    );
    assert.deepEqual(posting.author, {
      "@type": "Person",
      name: "Jasmine Naderi",
      url: "https://www.smfclearinghouse.com/about/",
    });
    assert.equal(posting.datePublished, "2026-10-31");
    assert.equal(posting.dateModified, "2026-10-31");
    assert.equal(posting.publisher["@type"], "Organization");
    assert.equal(posting.publisher.name, ORG_NAME);
    assert.equal(posting.publisher.name, "SMF Works");
    assert.equal(posting.publisher.worksFor, undefined);
    assert.equal(posting.author.worksFor, undefined);
    assert.equal(
      posting.mainEntityOfPage["@id"],
      "https://www.smfclearinghouse.com/blog/2026-10-31-paste-the-picture-leave-the-draw/",
    );
    assert.deepEqual(
      crumbs.itemListElement.map((item) => item.name),
      ["Home", "Blog", "Paste the Picture. Leave the Draw."],
    );
  });
});

describe("related posts", () => {
  const posts = [
    { slug: "a", series: "jasmine", tags: ["hermes", "vision"], date: "2026-10-01", title: "A" },
    { slug: "b", series: "jasmine", tags: ["hermes"], date: "2026-10-30", title: "B" },
    { slug: "c", series: "liam", tags: ["vision"], date: "2026-10-20", title: "C" },
    { slug: "d", series: "jeff", tags: ["windows"], date: "2026-10-29", title: "D" },
    { slug: "e", series: "jasmine", tags: ["workshop"], date: "2026-09-01", title: "E" },
    { slug: "f", series: "jasmine", tags: ["hermes", "vision", "paste"], date: "2026-08-01", title: "F" },
  ];

  test("returns at most four posts from the same series or shared tags", () => {
    const current = {
      slug: "current",
      series: "jasmine",
      tags: ["hermes", "vision", "paste"],
      date: "2026-10-31",
    };
    const related = selectRelatedPosts(current, posts);
    assert.ok(related.length >= 3 && related.length <= 4);
    assert.equal(related.some((post) => post.slug === "d"), false);
    assert.equal(related[0].slug, "f");
    assert.equal(related.some((post) => post.slug === "current"), false);
  });
});

describe("FAQ answers", () => {
  test("keeps each answer in the 40 to 60 word range and mirrors six questions", () => {
    assert.equal(CLEARINGHOUSE_FAQS.length, 6);
    for (const faq of CLEARINGHOUSE_FAQS) {
      assert.match(faq.question, /\?$/);
      const count = wordCount(faq.answer);
      assert.ok(count >= 40 && count <= 60, `${faq.question} has ${count} words`);
    }
    const lead = wordCount(GETTING_STARTED_ANSWER);
    assert.ok(lead >= 40 && lead <= 60, `getting started answer has ${lead} words`);
  });
});

describe("audited blog posts", () => {
  test("truncates the sampled excerpts and finds three or four related posts", () => {
    const catalog = getBlogCatalog();
    const slugs = [
      "2026-10-31-paste-the-picture-leave-the-draw",
      "2026-10-31-select-andrew-dragon-hd-before-personal-voice",
    ];
    for (const slug of slugs) {
      const post = getBlogPostBySlug(slug);
      assert.ok(post, slug);
      const description = truncateMetaDescription(post.excerpt);
      assert.ok(description.length <= 160, `${slug} description is ${description.length}`);
      assert.ok(description.length >= 70, `${slug} description is ${description.length}`);
      const related = selectRelatedPosts(post, catalog);
      assert.ok(related.length >= 3 && related.length <= 4, `${slug} related ${related.length}`);
      assert.equal(related.some((item) => item.slug === slug), false);
    }
  });
});

describe("Organization sameAs", () => {
  test("uses cited public profiles and does not invent a LinkedIn URL", () => {
    const org = siteJsonLd["@graph"].find((node) => node["@type"] === "Organization");
    assert.equal(org.name, "SMF Works");
    assert.ok(org.sameAs.includes("https://github.com/smfworks"));
    assert.ok(org.sameAs.includes("https://github.com/smfworks/aiclearinghouse-site"));
    assert.ok(org.sameAs.includes("https://x.com/smfworks"));
    assert.ok(org.sameAs.includes("https://x.com/MichaelGannotti"));
    assert.equal(org.sameAs.some((url) => url.includes("linkedin.com")), false);
  });
});
