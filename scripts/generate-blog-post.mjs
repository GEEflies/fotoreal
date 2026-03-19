/**
 * AI blog post generator for RealFoto.
 * Uses Anthropic Claude API to generate Slovak-language blog posts
 * about real estate photography.
 *
 * Usage: node scripts/generate-blog-post.mjs [optional-topic-hint]
 *
 * Requires: ANTHROPIC_API_KEY env var
 */

import { writeFileSync, readdirSync, readFileSync } from "fs";
import { resolve, join } from "path";

const CONTENT_DIR = resolve("src/content/blog");

// Get existing post slugs to avoid duplicates
function getExistingSlugs() {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

// Get existing post titles for context
function getExistingTitles() {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const data = JSON.parse(readFileSync(join(CONTENT_DIR, f), "utf-8"));
        return data.title;
      });
  } catch {
    return [];
  }
}

async function generatePost(topicHint) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY env var is required");
  }

  const existingTitles = getExistingTitles();
  const existingSlugs = getExistingSlugs();

  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are an SEO content writer for RealFoto (realfoto.sk), a Slovak AI-powered real estate photo editing service.

Generate a blog post in SLOVAK language about real estate photography, property marketing, or related topics.

${topicHint ? `Topic hint: ${topicHint}` : "Choose a topic that would be valuable for Slovak real estate agents and property sellers."}

${existingTitles.length > 0 ? `Existing posts (do NOT duplicate these topics):\n${existingTitles.map((t) => `- ${t}`).join("\n")}` : ""}

Requirements:
- Write entirely in Slovak
- 800-1200 words
- Include practical, actionable advice
- Naturally mention RealFoto where relevant (not forced)
- SEO-optimized: include relevant keywords naturally
- Use markdown formatting (## for h2, ### for h3, **bold**, etc.)
- Include a compelling meta description (max 155 characters)
- Generate 3-5 relevant tags

Respond ONLY with valid JSON (no markdown code fences) in this exact format:
{
  "slug": "url-friendly-slug-no-diacritics",
  "title": "Compelling Slovak title",
  "description": "Meta description in Slovak, max 155 chars",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "Full markdown content of the blog post"
}

Important: The slug must use only lowercase letters, numbers, and hyphens (no Slovak diacritics).`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  let post;
  try {
    post = JSON.parse(text);
  } catch {
    // Try to extract JSON from response if wrapped in other text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      post = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse AI response as JSON");
    }
  }

  // Validate required fields
  if (!post.slug || !post.title || !post.description || !post.content) {
    throw new Error("Missing required fields in generated post");
  }

  // Ensure slug doesn't already exist
  if (existingSlugs.includes(post.slug)) {
    post.slug = `${post.slug}-${Date.now()}`;
  }

  // Add date and image placeholder
  post.date = today;
  post.image = `/blog/images/${post.slug}.webp`;

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
}

main().catch((err) => {
  console.error("Failed to generate blog post:", err.message);
  process.exit(1);
});
