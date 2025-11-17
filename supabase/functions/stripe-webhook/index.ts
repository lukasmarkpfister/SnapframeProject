import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !stripeWebhookSecret) {
      return new Response(
        JSON.stringify({ error: "Missing signature or webhook secret" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.text();
    
    // In production, verify webhook signature here
    const event = JSON.parse(body);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name;

      if (orderId) {
        // Update order with payment info and customer email from Stripe
        const { error } = await supabaseClient
          .from("orders")
          .update({
            status: "paid",
            stripe_session_id: session.id,
            customer_email: customerEmail || '',
            customer_name: customerName || null,
          })
          .eq("id", orderId);

        if (error) {
          console.error("Error updating order:", error);
          throw error;
        }

        // Get updated order details
        const { data: order } = await supabaseClient
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        // Send order confirmation email
        if (order?.customer_email && order.customer_email !== '') {
          const resendApiKey = Deno.env.get("RESEND_API_KEY");
          if (resendApiKey) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "LightPicture <bestellungen@lightpicture-3d.com>",
                to: order.customer_email,
                subject: "Bestellbestätigung - LightPicture",
                html: `
                  <h1>Vielen Dank für Ihre Bestellung!</h1>
                  <p>Hallo ${order.customer_name || 'Kunde'},</p>
                  <p>Ihre Zahlung wurde erfolgreich verarbeitet und Ihre Bestellung ist bei uns eingegangen.</p>
                  <h2>Bestelldetails:</h2>
                  <ul>
                    <li><strong>Bestellung-ID:</strong> ${orderId.slice(0, 8)}</li>
                    <li><strong>Rahmenfarbe:</strong> ${order.frame_color === 'black' ? 'Schwarz' : 'Weiß'}</li>
                    <li><strong>Preis:</strong> 29,90 €</li>
                  </ul>
                  <p>Wir beginnen umgehend mit der Produktion Ihres personalisierten 3D-Bilderrahmens.</p>
                  <p>Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versendet wird.</p>
                  <p>Bei Fragen erreichen Sie uns unter support@lightpicture-3d.com</p>
                  <p>Viele Grüße,<br>Ihr LightPicture Team</p>
                `,
              }),
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Webhook failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
