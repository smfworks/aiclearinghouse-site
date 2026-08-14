/**
 * generate-hero.mjs — Generate blog hero images using Together.ai FLUX.2-pro
 *
 * Usage:
 *   TOGETHER_API_KEY=... node scripts/generate-hero.mjs "Post Title" "blog/filename-hero.png"
 *
 * Fail-closed: refuses to run without TOGETHER_API_KEY in the environment.
 * Never hardcode credentials in this file.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const MODEL = "black-forest-labs/FLUX.2-pro";
export const IMAGE_DIR = "public/images";

export function resolveTogetherApiKey(env = process.env) {
  const raw = env.TOGETHER_API_KEY;
  const key = typeof raw === "string" ? raw.trim() : "";
  if (!key) {
    return {
      ok: false,
      error:
        "TOGETHER_API_KEY is required. Set it in the environment (or a gitignored .env loaded by your shell). Do not hardcode secrets.",
    };
  }
  return { ok: true, key };
}

export function parseHeroArgs(argv, imageDir = IMAGE_DIR) {
  if (!Array.isArray(argv) || argv.length < 2) {
    return {
      ok: false,
      error:
        'Usage: node scripts/generate-hero.mjs "Post Title" "blog/filename-hero.png"',
    };
  }
  const title = String(argv[0] ?? "").trim();
  const filename = String(argv[1] ?? "").trim().replace(/\\/g, "/");
  if (!title || !filename) {
    return { ok: false, error: "Title and output filename are required." };
  }
  if (path.isAbsolute(filename) || filename.split("/").includes("..")) {
    return {
      ok: false,
      error: "Output path must be a relative path under public/images/.",
    };
  }
  return {
    ok: true,
    title,
    filename,
    outputPath: `${imageDir}/${filename}`,
  };
}

export function buildPrompt(title) {
  return `Professional editorial hero image for a technology blog post. Clean, modern, dark theme with subtle blue and cyan accents. Microsoft-inspired design language. Abstract geometric patterns representing AI, cloud computing, and intelligent agents. No text or typography. Cinematic lighting, 8K quality, depth of field. Topic context: "${title}".`;
}

export async function generateImage(
  prompt,
  outputPath,
  { apiKey, fetchImpl = fetch } = {},
) {
  if (!apiKey) {
    throw new Error("apiKey is required");
  }

  console.error(`Generating image for: "${String(prompt).slice(0, 80)}..."`);

  const response = await fetchImpl("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      width: 1216,
      height: 640,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Together API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`No image data in response: ${JSON.stringify(data)}`);
  }

  const fullPath = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, Buffer.from(b64, "base64"));
  console.log(`Saved: ${fullPath}`);
  console.log(`URL: /images/${path.relative(IMAGE_DIR, outputPath).replace(/\\/g, "/")}`);
  return fullPath;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const parsed = parseHeroArgs(argv);
  if (!parsed.ok) {
    console.error(parsed.error);
    return 1;
  }
  const auth = resolveTogetherApiKey(env);
  if (!auth.ok) {
    console.error(auth.error);
    return 1;
  }
  try {
    await generateImage(buildPrompt(parsed.title), parsed.outputPath, {
      apiKey: auth.key,
    });
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return 1;
  }
  return 0;
}

const invokedDirectly =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly) {
  process.exit(await main());
}
