import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

async function analyzePhoto(imageUrl: string, apiKey: string): Promise<AnalysisResult> {
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
                  mime_type: "image/jpeg",
                  data: await fetchImageAsBase64(imageUrl),
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

async function fetchImageAsBase64(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`);
  const buffer = await resp.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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

async function enhancePhoto(imageUrl: string, prompt: string, apiKey: string): Promise<string | null> {
  const imageBase64 = await fetchImageAsBase64(imageUrl);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Generator failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts;
  if (!parts) return null;

  for (const part of parts) {
    if (part.inline_data?.data) {
      return `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
    }
  }
  return null;
}

function getFriendlyPhotoError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("[429]")) return "Chyba: Príliš veľa požiadaviek, skúste to znova o chvíľu";
  if (message.includes("[402]")) return "Chyba: Nedostatok kreditu na Gemini API";
  if (message.includes("NOT_FOUND") || message.includes("[404]")) {
    return "Chyba: AI model pre generovanie obrázkov nie je dostupný";
  }
  if (message.toLowerCase().includes("safety")) {
    return "Chyba: Fotka bola zablokovaná bezpečnostným filtrom AI";
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
        await updatePhotoStatus(supabase, photo.id, "enhancing", "Vylepšujem fotku...");
        const editedImageUrl = await enhancePhoto(photo.original_url, prompt, GEMINI_API_KEY);

        if (editedImageUrl) {
          const base64Data = editedImageUrl.replace(/^data:image\/\w+;base64,/, "");
          const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
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
          const { data: propData } = await supabase
            .from("properties")
            .select("user_id")
            .eq("id", property_id)
            .single();
          if (propData?.user_id) {
            await supabase.rpc("increment_total_used", { _user_id: propData.user_id });
          }
        } else {
          await updatePhotoStatus(supabase, photo.id, "done", "Hotovo");
        }
      } catch (photoError: unknown) {
        console.error(`Error processing photo ${photo.id}:`, photoError);
        const isRateLimit = photoError instanceof Error &&
          (photoError.message.includes("[429]") || photoError.message.includes("[402]"));
        const errorLabel = isRateLimit
          ? "Chyba: Rate limit"
          : "Chyba pri spracovaní";
        await updatePhotoStatus(supabase, photo.id, "error", errorLabel);
        if (isRateLimit) break;
      }
    }

    const { data: remainingPhotos } = await supabase
      .from("property_photos")
      .select("id")
      .eq("property_id", property_id)
      .neq("ai_status", "done")
      .neq("ai_status", "error");

    const finalStatus = (!remainingPhotos || remainingPhotos.length === 0) ? "done" : "error";
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
