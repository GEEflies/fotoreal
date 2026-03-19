/**
 * AI blog post generator for RealFoto.
 * Uses Google Gemini 2.5 Flash to generate Slovak-language SEO blog posts
 * about real estate photography.
 *
 * Usage: node scripts/generate-blog-post.mjs [optional-topic-hint]
 *
 * Requires: GEMINI_API_KEY env var
 */

import { writeFileSync, readdirSync, readFileSync } from "fs";
import { resolve, join } from "path";

const CONTENT_DIR = resolve("src/content/blog");
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function getExistingPosts() {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const data = JSON.parse(readFileSync(join(CONTENT_DIR, f), "utf-8"));
        return { slug: data.slug, title: data.title, tags: data.tags || [] };
      });
  } catch {
    return [];
  }
}

async function generatePost(topicHint) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY env var is required");
  }

  const existingPosts = getExistingPosts();
  const existingSlugs = existingPosts.map((p) => p.slug);
  const today = new Date().toISOString().split("T")[0];

  const prompt = `Si SEO copywriter pre RealFoto (realfoto.sk) — slovenský AI editor realitných fotografií. Služba automaticky vylepšuje fotky nehnuteľností pomocou AI (HDR, výmena oblohy, korekcia perspektívy, rozmazanie tvárí/ŠPZ, virtuálny staging).

Napíš blog článok v SLOVENČINE na tému realitnej fotografie, marketingu nehnuteľností alebo súvisiacich tém.

${topicHint ? `Téma: ${topicHint}` : "Vyber tému, ktorá by bola hodnotná pre slovenských realitných maklérov a predajcov nehnuteľností."}

${existingPosts.length > 0 ? `Existujúce články (NEDUPLIKUJ tieto témy):\n${existingPosts.map((p) => `- ${p.title}`).join("\n")}` : ""}

POŽIADAVKY NA OBSAH:
- 1500-2000 slov, podrobný a praktický
- Používaj štruktúru: H1 nadpis, úvod (2-3 vety hook), 4-6 sekcií s H2 nadpismi, záver s výzvou na akciu
- Každá sekcia 200-400 slov s konkrétnymi radami
- Na konci pridaj sekciu "## Často kladené otázky" s 3-4 otázkami a odpoveďami
- Piš z prvej osoby plurálu ako RealFoto tím ("V RealFoto sme zistili...", "Naši klienti často...", "Na základe našich skúseností...")
- Pridaj konkrétne čísla a štatistiky kde je to relevantné
- Prirodzene vlož 2-3 interné linky na stránky RealFoto v markdown formáte:
  - [vyskúšajte RealFoto zadarmo](/login)
  - [pozrite si naše funkcie](/funkcie)
  - [cenník](/cennik)
  - [ako to funguje](/ako-to-funguje)

POŽIADAVKY NA SEO:
- Hlavné kľúčové slovo v H1, prvom odseku a v 2-3 H2 nadpisoch
- Meta popis max 155 znakov, obsahuje kľúčové slovo
- Slug bez diakritiky, iba malé písmená, čísla a pomlčky
- 3-5 relevantných tagov

FORMÁT ODPOVEDE (iba platný JSON, žiadne markdown code fences):
{
  "slug": "url-friendly-slug-bez-diakritiky",
  "title": "Pútavý slovenský nadpis s kľúčovým slovom",
  "description": "Meta popis v slovenčine, max 155 znakov",
  "tags": ["tag1", "tag2", "tag3"],
  "readingTime": 7,
  "content": "Celý markdown obsah článku"
}`;

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();

  // Check for blocked/empty responses
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    const reason = data.candidates?.[0]?.finishReason || "unknown";
    throw new Error(`Gemini returned no content (reason: ${reason})`);
  }

  const text = data.candidates[0].content.parts[0].text.trim();

  let post;
  try {
    post = JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      post = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse Gemini response as JSON");
    }
  }

  // Validate required fields
  if (!post.slug || !post.title || !post.description || !post.content) {
    throw new Error(
      `Missing required fields in generated post. Got keys: ${Object.keys(post).join(", ")}`
    );
  }

  // Ensure slug doesn't already exist
  if (existingSlugs.includes(post.slug)) {
    post.slug = `${post.slug}-${Date.now()}`;
  }

  // Add/override metadata
  post.date = today;
  post.image = `/blog/images/${post.slug}.webp`;
  post.readingTime = post.readingTime || Math.ceil(post.content.split(/\s+/).length / 200);

  return post;
}

async function main() {
  const topicHint = process.argv[2] || "";
  console.log(
    topicHint
      ? `Generating blog post about: ${topicHint}`
      : "Generating blog post (auto topic)..."
  );

  const post = await generatePost(topicHint);

  const filePath = join(CONTENT_DIR, `${post.slug}.json`);
  writeFileSync(filePath, JSON.stringify(post, null, 2) + "\n");

  console.log(`✓ Created: ${filePath}`);
  console.log(`  Title: ${post.title}`);
  console.log(`  Slug: ${post.slug}`);
  console.log(`  Tags: ${post.tags.join(", ")}`);
  console.log(`  Reading time: ${post.readingTime} min`);
  console.log(`  Word count: ~${post.content.split(/\s+/).length}`);
}

main().catch((err) => {
  console.error("Failed to generate blog post:", err.message);
  process.exit(1);
});
