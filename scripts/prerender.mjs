/**
 * Post-build prerender script.
 * Spins up a static server from dist/, visits each public route with Puppeteer,
 * and writes the fully-rendered HTML back to dist/<route>/index.html.
 *
 * Usage: node scripts/prerender.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { createServer } from "http";
import puppeteer from "puppeteer";

const DIST = resolve("dist");
const PORT = 4173;

// Static public routes to prerender
const STATIC_ROUTES = [
  "/",
  "/pre-fotografov",
  "/bez-fotografa",
  "/funkcie",
  "/cennik",
  "/ako-to-funguje",
  "/referencie",
  "/o-nas",
  "/kontakt",
  "/blog",
  "/ochrana-sukromia",
  "/obchodne-podmienky",
];

// Auto-discover blog post routes from built content
function getBlogPostRoutes() {
  try {
    // Read the built JS to find blog slugs — but easier to scan source content dir
    const contentDir = resolve("src/content/blog");
    const files = readdirSync(contentDir).filter((f) => f.endsWith(".json"));
    return files.map((f) => {
      const data = JSON.parse(readFileSync(join(contentDir, f), "utf-8"));
      return `/blog/${data.slug}`;
    });
  } catch {
    return [];
  }
}

// Simple static file server for the dist folder
function startServer() {
  const mime = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".webmanifest": "application/manifest+json",
  };

  const server = createServer((req, res) => {
    let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);
    try {
      const data = readFileSync(filePath);
      const ext = "." + filePath.split(".").pop();
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      res.end(data);
    } catch {
      // SPA fallback
      const data = readFileSync(join(DIST, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

async function prerender() {
  const routes = [...STATIC_ROUTES, ...getBlogPostRoutes()];
  console.log(`Prerendering ${routes.length} routes...`);

  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const route of routes) {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;

    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

      // Wait a bit for React to finish rendering
      await page.waitForSelector("#root > *", { timeout: 10000 });

      const html = await page.content();

      // Write to dist/<route>/index.html
      const outDir = route === "/" ? DIST : join(DIST, route);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, "index.html"), html);
      console.log(`  ✓ ${route}`);
    } catch (err) {
      console.error(`  ✗ ${route}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log("Prerendering complete.");
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
