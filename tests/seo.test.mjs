import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { register } from "node:module";
import { describe, test } from "node:test";
import matter from "gray-matter";
register("./resolve-ts.mjs", import.meta.url);

const { CLEARINGHOUSE_FAQS, GETTING_STARTED_ANSWER } = await import("../lib/clearinghouse-faq.ts");
const {
  blogPostJsonLd,
  extractQuestionAnswers,
  fitPageTitle,
  guideArticleJsonLd,
  guidePageMetadata,
  isoDate,
  omitDuplicateTitleHeading,
  selectRelatedPosts,
  truncateMetaDescription,
  wordCount,
} = await import("../lib/seo.ts");
const { DEFAULT_OG_IMAGE, ORG_NAME, siteJsonLd } = await import("../lib/site.ts");
const { getBlogCatalog, getBlogPostBySlug } = await import("../lib/blog/loader.ts");
const { markdownToHtml } = await import("../lib/markdown.ts");

function loadGuides() {
  const dir = path.join(process.cwd(), "content", "guides");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const parsed = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return {
        slug: String(parsed.data.slug || file.replace(/\.md$/, "")),
        title: String(parsed.data.title || ""),
        excerpt: String(parsed.data.excerpt || ""),
        content: parsed.content.trimStart(),
        date: parsed.data.last_verified,
        image: parsed.data.image ? String(parsed.data.image) : undefined,
      };
    });
}

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

describe("guide pages", () => {
  const guides = loadGuides();
  const sampled = ["turn-on-jev-images", "opt-out-of-chatgpt-ad-rewrites"];

  test("fits every guide title to 30–60 characters with the topic first", () => {
    assert.ok(guides.length > 50);
    for (const guide of guides) {
      const title = fitPageTitle(guide.title);
      assert.ok(title.length >= 30 && title.length <= 60, `${guide.slug} title ${title.length}: ${title}`);
      assert.equal(guide.title.startsWith(title), true, `${guide.slug} dropped the topic: ${title}`);
    }
    const jev = guides.find((guide) => guide.slug === "turn-on-jev-images");
    const ads = guides.find((guide) => guide.slug === "opt-out-of-chatgpt-ad-rewrites");
    assert.equal(fitPageTitle(jev.title), jev.title);
    assert.equal(fitPageTitle(ads.title), ads.title);
  });

  test("keeps guide meta descriptions between 70 and 160 characters", () => {
    for (const guide of guides) {
      const description = truncateMetaDescription(guide.excerpt);
      assert.ok(description.length >= 70 && description.length <= 160, `${guide.slug} description ${description.length}`);
    }
  });

  test("emits BlogPosting, breadcrumbs, and no invented image on the sampled guides", () => {
    for (const slug of sampled) {
      const guide = guides.find((item) => item.slug === slug);
      assert.ok(guide, slug);
      const data = guideArticleJsonLd({
        ...guide,
        date: guide.date instanceof Date ? String(guide.date) : guide.date,
      });
      const posting = data["@graph"].find((node) => node["@type"] === "BlogPosting");
      const crumbs = data["@graph"].find((node) => node["@type"] === "BreadcrumbList");
      const faq = data["@graph"].find((node) => node["@type"] === "FAQPage");

      assert.equal(posting.headline, guide.title);
      assert.ok(posting.description.length >= 70 && posting.description.length <= 160);
      assert.equal(posting.image, undefined);
      assert.deepEqual(posting.author, {
        "@type": "Person",
        name: "Pamela Flannery",
        url: "https://www.smfclearinghouse.com/about/",
      });
      assert.equal(posting.author.worksFor, undefined);
      assert.equal(posting.datePublished, "2026-10-21");
      assert.equal(posting.dateModified, "2026-10-21");
      assert.equal(posting.publisher["@type"], "Organization");
      assert.equal(posting.publisher.name, "SMF Works");
      assert.equal(posting.publisher.worksFor, undefined);
      assert.equal(posting.mainEntityOfPage["@id"], `https://www.smfclearinghouse.com/guides/${slug}/`);
      assert.deepEqual(
        crumbs.itemListElement.map((item) => item.name),
        ["Home", "How-To Guides", guide.title],
      );

      const answers = extractQuestionAnswers(guide.content);
      assert.ok(answers.length >= 4, `${slug} questions ${answers.length}`);
      assert.ok(faq, `${slug} is missing FAQPage for its visible answers`);
      assert.equal(faq.mainEntity.length, answers.length);
      for (const answer of answers) {
        assert.match(answer.question, /\?$/);
        const count = wordCount(answer.answer);
        assert.ok(count >= 40 && count <= 60, `${answer.question} has ${count} words`);
        const matched = faq.mainEntity.find((node) => node.name === answer.question);
        assert.equal(matched.acceptedAnswer.text, answer.answer);
      }

      const html = markdownToHtml(omitDuplicateTitleHeading(guide.content, guide.title));
      assert.equal(/<h1[\s>]/i.test(html), false, `${slug} markdown still has an H1`);
      assert.match(html, /<h2[\s>]/i);
    }
  });

  test("omits dates and FAQPage when the guide has neither", () => {
    const quiet = guides.find((guide) => extractQuestionAnswers(guide.content).length === 0 && !guide.date);
    assert.ok(quiet, "expected a guide with no question answers and no date");
    const data = guideArticleJsonLd(quiet);
    const posting = data["@graph"].find((node) => node["@type"] === "BlogPosting");
    assert.equal(posting.datePublished, undefined);
    assert.equal(posting.dateModified, undefined);
    assert.equal(data["@graph"].some((node) => node["@type"] === "FAQPage"), false);
  });

  test("emits og:image and a matching twitter card for every guide", () => {
    const sampled = ["turn-on-jev-images", "opt-out-of-chatgpt-ad-rewrites"];
    for (const slug of sampled) {
      const guide = guides.find((item) => item.slug === slug);
      assert.ok(guide, slug);
      assert.equal(guide.image, undefined);
    }

    for (const guide of guides) {
      const meta = guidePageMetadata(guide);
      const image = meta.openGraph.images[0];
      assert.match(image.url, /^https:\/\//);
      assert.equal(meta.twitter.card, "summary_large_image");
      assert.equal(meta.twitter.images[0], image.url);
      assert.equal(meta.title, fitPageTitle(guide.title));
      assert.equal(meta.description, truncateMetaDescription(guide.excerpt));
      assert.equal(meta.openGraph.url, `https://www.smfclearinghouse.com/guides/${guide.slug}/`);
      if (!guide.image) {
        assert.equal(image.url, DEFAULT_OG_IMAGE.url);
        assert.equal(image.width, DEFAULT_OG_IMAGE.width);
        assert.equal(image.height, DEFAULT_OG_IMAGE.height);
        assert.equal(image.alt, DEFAULT_OG_IMAGE.alt);
      }
    }

    for (const slug of sampled) {
      const meta = guidePageMetadata(guides.find((item) => item.slug === slug));
      assert.equal(meta.openGraph.images[0].url, "https://smfclearinghouse.com/images/clearinghouse-og.png");
      assert.equal(meta.twitter.images[0], meta.openGraph.images[0].url);
    }
  });

  test("uses a guide image for og:image and twitter:image when one is set", () => {
    const meta = guidePageMetadata({
      slug: "example-guide",
      title: "Turn on Jev images before you send a box",
      excerpt: "Images and box questions are off until the request carries the header.",
      image: "/images/guides/example.png",
      date: "2026-10-21",
    });
    assert.equal(
      meta.openGraph.images[0].url,
      "https://www.smfclearinghouse.com/images/guides/example.png",
    );
    assert.equal(meta.openGraph.images[0].alt, "Turn on Jev images before you send a box");
    assert.equal(meta.openGraph.images[0].width, undefined);
    assert.equal(meta.twitter.card, "summary_large_image");
    assert.equal(meta.twitter.images[0], meta.openGraph.images[0].url);
    assert.equal(meta.openGraph.publishedTime, "2026-10-21");

    const absolute = guidePageMetadata({
      slug: "example-guide",
      title: "Turn on Jev images before you send a box",
      excerpt: "Images and box questions are off until the request carries the header.",
      image: "https://cdn.example.com/guide.png",
    });
    assert.equal(absolute.openGraph.images[0].url, "https://cdn.example.com/guide.png");
    assert.equal(absolute.openGraph.publishedTime, undefined);
    assert.equal(absolute.twitter.images[0], "https://cdn.example.com/guide.png");
  });

  test("reads an unquoted YAML date after it has been stringified", () => {
    const guide = guides.find((item) => item.slug === "choosing-your-first-agent");
    assert.ok(guide.date instanceof Date);
    assert.equal(isoDate(String(guide.date)), "2026-06-15");
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
