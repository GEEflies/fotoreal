/**
 * Pings IndexNow API to instantly notify search engines (Bing, Yandex, Seznam.cz)
 * about new or updated URLs.
 *
 * Usage: node scripts/ping-indexnow.mjs <url1> [url2] [url3] ...
 * Example: node scripts/ping-indexnow.mjs https://realfoto.sk/blog/my-post
 */

const INDEXNOW_KEY = "realfoto-indexnow-2026";
const HOST = "realfoto.sk";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

async function pingIndexNow(urls) {
  if (!urls.length) {
    console.log("No URLs to submit.");
    return;
  }

  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);
  urls.forEach((u) => console.log(`  → ${u}`));

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok || response.status === 202) {
      console.log(`✓ IndexNow accepted (status ${response.status})`);
    } else {
      const text = await response.text();
      console.error(`✗ IndexNow rejected (status ${response.status}): ${text}`);
    }
  } catch (err) {
    console.error(`✗ IndexNow request failed: ${err.message}`);
  }
}

const urls = process.argv.slice(2).filter(Boolean);
if (urls.length === 0) {
  console.error("Usage: node scripts/ping-indexnow.mjs <url1> [url2] ...");
  process.exit(1);
}

pingIndexNow(urls);
