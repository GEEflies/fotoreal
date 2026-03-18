import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANALYZER_SYSTEM_PROMPT = `You are a real estate photography quality inspector. Analyze the provided photo and evaluate it against this checklist:

BASE (applies to every photo):
- HDR: Does the photo lack dynamic range? Are there crushed blacks or blown highlights?
- Lighting: Are there dark corners, underexposed shadows, or uneven lighting?
- White balance: Is the color temperature off (too warm/cool)? Target is ~5500K daylight.
- Perspective correction: Are vertical lines (walls, door frames) noticeably tilted?

INTERIOR features (only if scene is interior or mixed):
- Homestaging: Is there visible clutter, mess, or items that should be virtually removed/tidied?
- Window pulling: Are windows completely blown out white, needing interior/exterior exposure balance?

EXTERIOR features (only if scene is exterior or mixed):
- Sky replacement: Is the sky overcast, gray, or unappealing? Should it be replaced with clear blue sky?

Be precise and honest. If something looks fine, mark it as ok/false. Only flag what truly needs improvement.

IMPORTANT: You MUST respond with a valid JSON object in this exact format:
{
  "scene_type": "interior" | "exterior" | "mixed",
  "base": {
    "hdr": boolean,
    "lighting": "description or ok",
    "white_balance": "description or ok",
    "perspective_correction": boolean
  },
  "interior": {
    "homestaging": boolean,
    "homestaging_notes": "string or empty",
    "window_pulling": boolean
  },
  "exterior": {
    "sky_replacement": boolean
  }
}`;

interface AnalysisResult {
  scene_type: string;
  base: {
    hdr: boolean;
    lighting: string;
    white_balance: string;
    perspective_correction: boolean;
  };
  interior: {
    homestaging: boolean;
    homestaging_notes?: string;
    window_pulling: boolean;
  };
  exterior: {
    sky_replacement: boolean;
  };
}

async function updatePhotoStatus(
  supabase: ReturnType<typeof createClient>,
  photoId: string,
  status: string,
  label: string,
  processedUrl?: string
) {
  const update: Record<string, unknown> = { ai_status: status, ai_step_label: label };
  if (processedUrl) update.processed_url = processedUrl;
  await supabase.from("property_photos").update(update).eq("id", photoId);
}

async function fetchImageData(url: string): Promise<{ data: string; mimeType: string }> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`);

  const mimeType = resp.headers.get("content-type") || "image/jpeg";
  const buffer = await resp.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return {
    data: btoa(binary),
    mimeType,
  };
}

async function analyzePhoto(imageUrl: string, apiKey: string): Promise<AnalysisResult> {
  const image = await fetchImageData(imageUrl);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: ANALYZER_SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: "Analyze this real estate photo against the quality checklist. Return JSON only." },
              {
                inline_data: {
                  mime_type: image.mimeType,
                  data: image.data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Analyzer failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Analyzer returned no content");

  return JSON.parse(text) as AnalysisResult;
}

function buildEnhancementPrompt(analysis: AnalysisResult): string {
  const parts: string[] = [];
  parts.push(`Enhance this ${analysis.scene_type} real estate photo professionally.`);

  if (analysis.base.hdr) {
    parts.push("Apply HDR to increase dynamic range — brighten shadows and recover highlights.");
  }
  if (analysis.base.lighting && analysis.base.lighting !== "ok") {
    parts.push(`Fix lighting: ${analysis.base.lighting}.`);
  }
  if (analysis.base.white_balance && analysis.base.white_balance !== "ok") {
    parts.push(`Correct white balance: ${analysis.base.white_balance}.`);
  }
  if (analysis.base.perspective_correction) {
    parts.push("Correct perspective — straighten vertical and horizontal lines.");
  }

  if (analysis.scene_type === "interior" || analysis.scene_type === "mixed") {
    if (analysis.interior.homestaging) {
      const notes = analysis.interior.homestaging_notes || "remove clutter and tidy the space";
      parts.push(`Virtual homestaging: ${notes}.`);
    }
    if (analysis.interior.window_pulling) {
      parts.push("Pull window details — balance interior exposure with the view through windows.");
    }
  }

  if (analysis.scene_type === "exterior" || analysis.scene_type === "mixed") {
    if (analysis.exterior.sky_replacement) {
      parts.push("Replace the sky with a beautiful clear blue sky with soft white clouds.");
    }
  }

  parts.push("Keep the result photorealistic. Do not add or remove furniture unless specified. Maintain the original composition.");
  return parts.join(" ");
}

async function applyWatermark(
  imageBytes: Uint8Array,
  logoUrl: string,
  position: string
): Promise<Uint8Array> {
  // Decode the base image
  const baseImage = await Image.decode(imageBytes);

  // Fetch and decode the logo
  const logoResp = await fetch(logoUrl);
  if (!logoResp.ok) throw new Error(`Failed to fetch logo: ${logoResp.status}`);
  const logoBuffer = new Uint8Array(await logoResp.arrayBuffer());
  const logoImage = await Image.decode(logoBuffer);

  // Scale logo to ~8% of image width, maintaining aspect ratio
  const targetWidth = Math.round(baseImage.width * 0.08);
  const scale = targetWidth / logoImage.width;
  const targetHeight = Math.round(logoImage.height * scale);
  const scaledLogo = logoImage.resize(targetWidth, targetHeight);

  // Calculate position with padding (2% of image size)
  const padX = Math.round(baseImage.width * 0.02);
  const padY = Math.round(baseImage.height * 0.02);
  let x: number, y: number;

  switch (position) {
    case 'top-left':
      x = padX; y = padY; break;
    case 'top-right':
      x = baseImage.width - targetWidth - padX; y = padY; break;
    case 'bottom-left':
      x = padX; y = baseImage.height - targetHeight - padY; break;
    case 'center-center':
      x = Math.round((baseImage.width - targetWidth) / 2);
      y = Math.round((baseImage.height - targetHeight) / 2);
      break;
    case 'bottom-right':
    default:
      x = baseImage.width - targetWidth - padX;
      y = baseImage.height - targetHeight - padY;
      break;
  }

  // Composite the logo onto the image
  baseImage.composite(scaledLogo, x, y);

  // Encode back to PNG
  return await baseImage.encode();
}

async function enhancePhoto(imageUrl: string, prompt: string, apiKey: string): Promise<string | null> {
  const image = await fetchImageData(imageUrl);

  // Fallback chain: Pro first, then Nano Banana 2
  const models = [
    "gemini-3-pro-image-preview",
    "gemini-3.1-flash-image-preview",
  ];

  const requestBody = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: image.mimeType,
              data: image.data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        imageSize: "2K",
      },
    },
  });

  let lastError: Error | null = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Retry with exponential backoff for 429 rate limits
    const maxRetries = 2;
    const retryDelays = [3000, 6000];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });

      if (response.ok) {
        const data = await response.json();
        const part = data.candidates?.[0]?.content?.parts?.find((entry: Record<string, unknown>) => {
          const inlineData = (entry.inlineData ?? entry.inline_data) as Record<string, unknown> | undefined;
          return typeof inlineData?.data === "string";
        });

        const inlineData = (part?.inlineData ?? part?.inline_data) as Record<string, unknown> | undefined;
        const base64 = typeof inlineData?.data === "string" ? inlineData.data : null;
        const mimeType = typeof (inlineData?.mimeType ?? inlineData?.mime_type) === "string"
          ? String(inlineData?.mimeType ?? inlineData?.mime_type)
          : "image/png";

        if (base64) {
          console.log(`Enhanced with model: ${model}`);
          return `data:${mimeType};base64,${base64}`;
        }
        return null;
      }

      const errText = await response.text();
      lastError = new Error(`Generator failed [${response.status}]: ${errText}`);

      // Retry on 429 (rate limit)
      if (response.status === 429 && attempt < maxRetries) {
        console.log(`Rate limited (429) on ${model}, retrying in ${retryDelays[attempt]}ms`);
        await new Promise((r) => setTimeout(r, retryDelays[attempt]));
        continue;
      }

      // Fall through to next model on 503 (overloaded)
      if (response.status === 503) {
        console.log(`Model ${model} unavailable (503), trying next model...`);
        break;
      }

      // Any other error — don't retry, don't fallback
      throw lastError;
    }
  }

  throw lastError ?? new Error("All models unavailable");
}

function getFriendlyPhotoError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("[429]")) return "Chyba: Limit Gemini API bol prekročený, skúste to znova o chvíľu";
  if (message.includes("[403]")) return "Chyba: Gemini API kľúč nemá prístup k image editácii alebo je neplatný";
  if (message.includes("[400]")) return "Chyba: Gemini API odmietlo požiadavku na spracovanie fotky";
  if (message.includes("NOT_FOUND") || message.includes("[404]")) {
    return "Chyba: Gemini image model nie je dostupný";
  }
  if (message.toLowerCase().includes("safety")) {
    return "Chyba: Fotka bola zablokovaná bezpečnostným filtrom";
  }

  const compactMessage = message
    .replace(/\s+/g, " ")
    .replace(/^Error:\s*/i, "")
    .slice(0, 140);

  return `Chyba: ${compactMessage || "Nepodarilo sa spracovať fotku"}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property_id } = await req.json();
    if (!property_id) throw new Error("property_id is required");

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("properties").update({ status: "processing" }).eq("id", property_id);

    // Get user's profile for watermark settings
    const { data: propOwner } = await supabase
      .from("properties")
      .select("user_id")
      .eq("id", property_id)
      .single();

    let logoUrl: string | null = null;
    let watermarkPosition = "bottom-right";

    if (propOwner?.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("logo_url, watermark_position")
        .eq("user_id", propOwner.user_id)
        .maybeSingle();

      if (profile) {
        logoUrl = (profile as Record<string, unknown>).logo_url as string | null;
        watermarkPosition = ((profile as Record<string, unknown>).watermark_position as string) || "bottom-right";
      }
    }

    const { data: photos, error: photosError } = await supabase
      .from("property_photos")
      .select("*")
      .eq("property_id", property_id)
      .eq("ai_status", "pending");

    if (photosError) throw photosError;
    if (!photos || photos.length === 0) {
      await supabase.from("properties").update({ status: "done" }).eq("id", property_id);
      return new Response(JSON.stringify({ success: true, message: "No photos to process" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const photo of photos) {
      try {
        // Phase 1: Analyze
        await updatePhotoStatus(supabase, photo.id, "analyzing", "Analyzujem fotku...");
        const analysis = await analyzePhoto(photo.original_url, GEMINI_API_KEY);
        console.log(`Photo ${photo.id} analysis:`, JSON.stringify(analysis));

        // Phase 2: Enhance
        const prompt = buildEnhancementPrompt(analysis);
        await updatePhotoStatus(supabase, photo.id, "enhancing", "Upravujem fotku...");
        const editedImageUrl = await enhancePhoto(photo.original_url, prompt, GEMINI_API_KEY);

        if (editedImageUrl) {
          let base64Data = editedImageUrl.replace(/^data:image\/\w+;base64,/, "");
          let imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

          // Phase 3: Watermark (non-AI)
          if (logoUrl) {
            try {
              await updatePhotoStatus(supabase, photo.id, "enhancing", "Pridávam vodoznak...");
              imageBytes = await applyWatermark(imageBytes, logoUrl, watermarkPosition);
            } catch (wmError) {
              console.error(`Watermark error for photo ${photo.id}:`, wmError);
              // Continue without watermark - don't fail the whole photo
            }
          }

          const filePath = `processed/${property_id}/${photo.id}.png`;

          const { error: uploadError } = await supabase.storage
            .from("property-photos")
            .upload(filePath, imageBytes, { contentType: "image/png", upsert: true });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("property-photos")
              .getPublicUrl(filePath);
            await updatePhotoStatus(supabase, photo.id, "done", "Hotovo", urlData.publicUrl);
          } else {
            console.error(`Upload error for photo ${photo.id}:`, uploadError);
            await updatePhotoStatus(supabase, photo.id, "done", "Hotovo", editedImageUrl);
          }

          // Deduct credit after success
          if (propOwner?.user_id) {
            await supabase.rpc("increment_total_used", { _user_id: propOwner.user_id });
          }
        } else {
          await updatePhotoStatus(supabase, photo.id, "error", "Chyba: AI nedokázalo vygenerovať upravenú fotku");
        }
      } catch (photoError: unknown) {
        console.error(`Error processing photo ${photo.id}:`, photoError);
        const message = photoError instanceof Error ? photoError.message : String(photoError);
        const isRateLimit = message.includes("[429]") || message.includes("[402]");
        await updatePhotoStatus(supabase, photo.id, "error", getFriendlyPhotoError(photoError));
        if (isRateLimit) break;
      }
    }

    const { data: finalPhotos } = await supabase
      .from("property_photos")
      .select("ai_status")
      .eq("property_id", property_id);

    const hasPending = finalPhotos?.some((photo) => photo.ai_status !== "done" && photo.ai_status !== "error") ?? false;
    const hasErrors = finalPhotos?.some((photo) => photo.ai_status === "error") ?? false;
    const finalStatus = hasPending ? "processing" : hasErrors ? "error" : "done";
    await supabase.from("properties").update({ status: finalStatus }).eq("id", property_id);

    return new Response(
      JSON.stringify({ success: true, message: `Processed ${photos.length} photos` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Process photos error:", error);
    const message = error instanceof Error ? error.message : "Neznáma chyba";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
