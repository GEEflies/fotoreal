import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Price IDs mapped to photo packages
const PRICE_MAP: Record<number, string> = {
  20: "price_1TC3luC7GbaaYuOKfTDRQaER",
  40: "price_1TC3m7C7GbaaYuOK8dTuZMch",
  80: "price_1TC3m7C7GbaaYuOKXLTANPvP",
  160: "price_1TC3m8C7GbaaYuOKfg3Lzr0d",
  320: "price_1TC3m9C7GbaaYuOKX7hanY5p",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { photos, origin, cancelPath = "/pre-fotografov#balicky" } = await req.json();

    const priceId = PRICE_MAP[photos];
    if (!priceId) {
      throw new Error(`Invalid package: ${photos} photos`);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe not configured");
    }

    // Extract user identity via Supabase Auth (supports both HS256 and ECC keys)
    let userId: string | null = null;
    let userEmail: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
        userEmail = user.email ?? null;
      }
    }

    console.log(`Checkout: userId=${userId}, userEmail=${userEmail}, authHeader=${authHeader ? "present" : "missing"}`);

    // Create Checkout Session via Stripe API
    const params = new URLSearchParams({
      "mode": "payment",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "success_url": `${origin}/platba-uspesna?session_id={CHECKOUT_SESSION_ID}&photos=${photos}`,
      "cancel_url": `${origin}${cancelPath}`,
      "metadata[photos]": String(photos),
      "locale": "sk",
      "payment_method_types[0]": "card",
      "allow_promotion_codes": "true",
    });

    // Forward user identity so webhook can grant credits immediately
    if (userId) params.set("metadata[user_id]", userId);
    if (userEmail) params.set("customer_email", userEmail);

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const session = await response.json();

    if (session.error) {
      throw new Error(session.error.message);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
