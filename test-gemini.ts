// Quick Gemini API test — delete after testing
const GEMINI_API_KEY = "AIzaSyA5sIZtVsbzazmcN645hBDx4YnaCnkGM1c";

const MODELS = [
  "gemini-3-pro-image-preview",       // Nano Banana Pro
  "gemini-3.1-flash-image-preview",   // Nano Banana 2
  "gemini-2.5-flash-image",           // Nano Banana (stable)
];

async function testModel(model: string) {
  console.log(`\n=== Testing ${model} ===`);
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "Generate a small simple blue square on white background." }] },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    }
  );

  console.log(`Status: ${resp.status} ${resp.statusText}`);

  if (resp.ok) {
    const data = await resp.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    let hasImage = false;
    for (const part of parts) {
      if (part.text) console.log(`Text: ${part.text.slice(0, 100)}`);
      const inlineData = part.inlineData ?? part.inline_data;
      if (inlineData?.data) {
        hasImage = true;
        const sizeKB = Math.round((inlineData.data.length * 3) / 4 / 1024);
        console.log(`IMAGE OK! MIME: ${inlineData.mimeType ?? inlineData.mime_type}, Size: ~${sizeKB}KB`);
      }
    }
    if (!hasImage) console.log("WARNING: 200 OK but no image returned");
  } else {
    const err = await resp.text();
    console.error(err.slice(0, 300));
  }
}

async function main() {
  for (const model of MODELS) {
    await testModel(model);
  }
  console.log("\nAll tests done.");
}

main().catch(console.error);
