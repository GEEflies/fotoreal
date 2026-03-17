import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANALYSIS_TOOL = {
  type: "function" as const,
  function: {
    name: "photo_analysis",
    description: "Analyze a real estate photo and determine what enhancements are needed.",
    parameters: {
      type: "object",
      properties: {
        scene_type: {
          type: "string",
          enum: ["interior", "exterior", "mixed"],
          description: "Whether the photo shows interior, exterior, or a mix",
        },
        base: {
          type: "object",
          properties: {
            hdr: { type: "boolean", description: "Does the photo need HDR / dynamic range enhancement?" },
            lighting: { type: "string", description: "Description of lighting issues to fix, or 'ok' if fine" },
            white_balance: { type: "string", description: "White balance correction needed (e.g. 'shift to 5500K') or 'ok'" },
            perspective_correction: { type: "boolean", description: "Are vertical/horizontal lines noticeably crooked?" },
          },
          required: ["hdr", "lighting", "white_balance", "perspective_correction"],
        },
        interior: {
          type: "object",
          properties: {
            homestaging: { type: "boolean", description: "Should clutter/mess be cleaned up virtually?" },
            homestaging_notes: { type: "string", description: "What to clean/remove/tidy if homestaging is true" },
            window_pulling: { type: "boolean", description: "Are windows blown out / need exposure balancing?" },
          },
          required: ["homestaging", "window_pulling"],
        },
        exterior: {
          type: "object",
          properties: {
            sky_replacement: { type: "boolean", description: "Is the sky overcast/ugly and should be replaced with a clear blue sky?" },
          },
          required: ["sky_replacement"],
        },
      },
      required: ["scene_type", "base", "interior", "exterior"],
    },
  },
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

Be precise and honest. If something looks fine, mark it as ok/false. Only flag what truly needs improvement.`;

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
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: ANALYZER_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this real estate photo against the quality checklist." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      tools: [ANALYSIS_TOOL],
      tool_choice: { type: "function", function: { name: "photo_analysis" } },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Analyzer failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) {
    throw new Error("Analyzer returned no tool call");
  }

  return JSON.parse(toolCall.function.arguments) as AnalysisResult;
}

function buildEnhancementPrompt(analysis: AnalysisResult): string {
  const parts: string[] = [];

  parts.push(`Enhance this ${analysis.scene_type} real estate photo professionally.`);

  // Base enhancements
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

  // Interior
  if (analysis.scene_type === "interior" || analysis.scene_type === "mixed") {
    if (analysis.interior.homestaging) {
      const notes = analysis.interior.homestaging_notes || "remove clutter and tidy the space";
      parts.push(`Virtual homestaging: ${notes}.`);
    }
    if (analysis.interior.window_pulling) {
      parts.push("Pull window details — balance interior exposure with the view through windows so both look natural.");
    }
  }

  // Exterior
  if (analysis.scene_type === "exterior" || analysis.scene_type === "mixed") {
    if (analysis.exterior.sky_replacement) {
      parts.push("Replace the sky with a beautiful clear blue sky with soft white clouds.");
    }
  }

  parts.push("Keep the result photorealistic. Do not add or remove furniture unless specified. Maintain the original composition.");

  return parts.join(" ");
}

async function enhancePhoto(imageUrl: string, prompt: string, apiKey: string): Promise<string | null> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Generator failed [${response.status}]: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property_id } = await req.json();
    if (!property_id) throw new Error("property_id is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Set property to processing
    await supabase.from("properties").update({ status: "processing" }).eq("id", property_id);

    // Get all pending photos
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

    // Process each photo: analyze → enhance
    for (const photo of photos) {
      try {
        // Phase 1: Analyze
        await updatePhotoStatus(supabase, photo.id, "analyzing", "Analyzujem fotku...");

        const analysis = await analyzePhoto(photo.original_url, LOVABLE_API_KEY);
        console.log(`Photo ${photo.id} analysis:`, JSON.stringify(analysis));

        // Phase 2: Enhance
        const prompt = buildEnhancementPrompt(analysis);
        await updatePhotoStatus(supabase, photo.id, "enhancing", "Vylepšujem fotku...");

        const editedImageUrl = await enhancePhoto(photo.original_url, prompt, LOVABLE_API_KEY);

        if (editedImageUrl) {
          // Upload processed image to storage
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

          // Deduct 1 credit ONLY after successful processing
          const { data: propData } = await supabase
            .from("properties")
            .select("user_id")
            .eq("id", property_id)
            .single();
          if (propData?.user_id) {
            await supabase.rpc("increment_total_used", { _user_id: propData.user_id });
          }
        } else {
          // Generator returned no image — mark done with original (no credit charge)
          await updatePhotoStatus(supabase, photo.id, "done", "Hotovo");
        }
      } catch (photoError: unknown) {
        console.error(`Error processing photo ${photo.id}:`, photoError);
        const isRateLimit = photoError instanceof Error &&
          (photoError.message.includes("[429]") || photoError.message.includes("[402]"));
        const errorLabel = isRateLimit
          ? "Chyba: Rate limit / nedostatok kreditov"
          : "Chyba pri spracovaní";
        await updatePhotoStatus(supabase, photo.id, "error", errorLabel);

        if (isRateLimit) break; // Stop processing remaining photos
      }
    }

    // Check final status
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
