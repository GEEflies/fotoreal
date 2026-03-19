/**
 * Updates public/sitemap.xml with any new blog post routes.
 * Reads all blog posts from src/content/blog/ and ensures they're in the sitemap.
 *
 * Usage: node scripts/update-sitemap.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

const SITEMAP_PATH = resolve("public/sitemap.xml");
const CONTENT_DIR = resolve("src/content/blog");
const SITE_URL = "https://realfoto.sk";

function getBlogPosts() {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const data = JSON.parse(readFileSync(join(CONTENT_DIR, f), "utf-8"));
        return { slug: data.slug, date: data.date };
      });
  } catch {
    return [];
  }
}

function updateSitemap() {
  const posts = getBlogPosts();
  let sitemap = readFileSync(SITEMAP_PATH, "utf-8");

  let added = 0;
  for (const post of posts) {
    const blogUrl = `${SITE_URL}/blog/${post.slug}`;
    if (!sitemap.includes(blogUrl)) {
      const entry = `  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

      // Insert before closing </urlset>
      sitemap = sitemap.replace("</urlset>", `${entry}\n</urlset>`);
      added++;
    }
  }

  if (added > 0) {
    writeFileSync(SITEMAP_PATH, sitemap);
    console.log(`✓ Added ${added} blog post(s) to sitemap.xml`);
  } else {
    console.log("Sitemap already up to date.");
  }
}

updateSitemap();
