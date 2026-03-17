import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    const { photos, origin } = await req.json();

    const priceId = PRICE_MAP[photos];
    if (!priceId) {
      throw new Error(`Invalid package: ${photos} photos`);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe not configured");
    }

    // Create Checkout Session via Stripe API
    const params = new URLSearchParams({
      "mode": "payment",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "success_url": `${origin}/platba-uspesna?session_id={CHECKOUT_SESSION_ID}`,
      "cancel_url": `${origin}/pre-fotografov#balicky`,
      "metadata[photos]": String(photos),
      "locale": "sk",
      "payment_method_types[0]": "card",
    });

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
