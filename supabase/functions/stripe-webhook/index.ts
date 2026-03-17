import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

async function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts = signature.split(",").reduce((acc: Record<string, string>, part) => {
    const [key, value] = part.split("=");
    acc[key.trim()] = value;
    return acc;
  }, {});

  const timestamp = parts["t"];
  const expectedSig = parts["v1"];
  if (!timestamp || !expectedSig) return false;

  // Reject events older than 5 minutes
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp);
  if (age > 300) return false;

  const payload = `${timestamp}.${body}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const computed = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === expectedSig;
}

serve(async (req) => {
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig || !await verifyStripeSignature(body, sig, webhookSecret)) {
      console.error("Invalid Stripe signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const photos = parseInt(session.metadata?.photos || "0");
      const email = session.customer_details?.email;
      const name = session.customer_details?.name;
      const stripeSessionId = session.id;
      const amountTotal = session.amount_total; // in cents

      console.log(
        `Payment received: ${photos} photos, ${amountTotal / 100} EUR, ${email}`
      );

      // Store the purchase in Supabase
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase.from("purchases").insert({
        stripe_session_id: stripeSessionId,
        email,
        name,
        photos,
        amount_cents: amountTotal,
        status: "paid",
      });

      if (error) {
        console.error("Failed to store purchase:", error);
      } else {
        console.log("Purchase stored successfully");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
