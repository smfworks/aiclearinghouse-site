/**
 * generate-hero.mjs - Generate blog hero images using Together.ai FLUX.2-pro
 *
 * Usage:
 *   node scripts/generate-hero.mjs "Post Title" "blog/filename-hero.png"
 *
 * Env:
 *   TOGETHER_API_KEY - your Together.ai API key
 */

const API_KEY = "tgp_v1_lcIjblJqLUFUrfsA9iEZo-PrMFo3clEfbcii4oZPYgI";
const MODEL = "black-forest-labs/FLUX.2-pro";
const IMAGE_DIR = "public/images";

async function generateImage(prompt, outputPath) {
  console.error(`Generating image for: "${prompt.slice(0, 80)}..."`);

  const response = await fetch("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      width: 1216,
      height: 640,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`API error (${response.status}): ${err}`);
    process.exit(1);
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;

  if (!b64) {
    console.error("No image data in response:", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const fs = await import("node:fs");
  const path = await import("node:path");

  const fullPath = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, Buffer.from(b64, "base64"));

  console.log(`Saved: ${fullPath}`);
  console.log(`URL: /images/${path.relative(IMAGE_DIR, outputPath).replace(/\\/g, "/")}`);
  return fullPath;
}

// Prompt templates optimized for FLUX.2-pro — slick, modern, editorial
function buildPrompt(title) {
  return `Professional editorial hero image for a technology blog post. Clean, modern, dark theme with subtle blue and cyan accents. Microsoft-inspired design language. Abstract geometric patterns representing AI, cloud computing, and intelligent agents. No text or typography. Cinematic lighting, 8K quality, depth of field. Topic context: "${title}".`;
}

// Main
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node scripts/generate-hero.mjs \"Post Title\" \"blog/filename-hero.png\"");
  process.exit(1);
}

const title = args[0];
const filename = args[1];
const outputPath = `${IMAGE_DIR}/${filename}`;
const prompt = buildPrompt(title);

await generateImage(prompt, outputPath);
