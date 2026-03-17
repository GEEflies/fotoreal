import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_STEPS: { status: string; label: string; prompt: string }[] = [
  { status: "enhancing", label: "Vylepšujem kvalitu a HDR...", prompt: "Enhance this real estate photo: improve HDR, increase dynamic range, make colors more vibrant and natural. Brighten dark areas and preserve highlights. Make the photo look professional." },
  { status: "sky_replace", label: "Nahrádzam oblohu...", prompt: "Replace the sky in this real estate photo with a beautiful clear blue sky with some soft white clouds. Keep the rest of the image unchanged." },
  { status: "hdr", label: "Optimalizujem osvetlenie okien...", prompt: "Fix window pull/brightening in this real estate interior photo. Make the view through windows look natural and balanced with the interior lighting. If this is an exterior photo, just improve the overall lighting." },
  { status: "privacy_blur", label: "Rozmazávam tváre a ŠPZ...", prompt: "Blur any visible faces and license plates in this real estate photo for GDPR compliance. If there are no faces or license plates visible, return the image unchanged." },
];

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

    // Process each photo through all AI steps
    for (const photo of photos) {
      let currentImageUrl = photo.original_url;
      let hasError = false;

      for (const step of AI_STEPS) {
        try {
          await updatePhotoStatus(supabase, photo.id, step.status, step.label);

          const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3.1-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: step.prompt },
                    { type: "image_url", image_url: { url: currentImageUrl } },
                  ],
                },
              ],
              modalities: ["image", "text"],
            }),
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error(`AI step ${step.status} failed for photo ${photo.id}:`, response.status, errText);
            
            if (response.status === 429 || response.status === 402) {
              await updatePhotoStatus(supabase, photo.id, "error", `Chyba: ${response.status === 429 ? "Rate limit" : "Nedostatok kreditov"}`);
              hasError = true;
              break;
            }
            // Skip this step but continue with next
            continue;
          }

          const data = await response.json();
          const editedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (editedImageUrl) {
            // Upload the processed image to storage
            const base64Data = editedImageUrl.replace(/^data:image\/\w+;base64,/, "");
            const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
            const filePath = `processed/${property_id}/${photo.id}-${step.status}.png`;

            const { error: uploadError } = await supabase.storage
              .from("property-photos")
              .upload(filePath, imageBytes, { contentType: "image/png", upsert: true });

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from("property-photos")
                .getPublicUrl(filePath);
              currentImageUrl = urlData.publicUrl;
            }
          }
        } catch (stepError) {
          console.error(`Error in step ${step.status} for photo ${photo.id}:`, stepError);
          // Continue to next step
        }
      }

      if (!hasError) {
        // Mark photo as done with final processed URL
        await updatePhotoStatus(supabase, photo.id, "done", "Hotovo", currentImageUrl);
      }
    }

    // Check if all photos are done
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
