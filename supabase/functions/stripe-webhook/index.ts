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
      // Try shipping_details first, fall back to customer_details.address for Apple Pay
      const shippingAddress = session.shipping_details?.address || session.customer_details?.address;
      const customerPhone = session.customer_details?.phone;

      // Debug log to see what Stripe is sending
      console.log("Stripe session data:", JSON.stringify({
        customerEmail,
        customerName,
        customerPhone,
        shippingDetails: session.shipping_details,
        customerDetails: session.customer_details,
        addressUsed: shippingAddress
      }, null, 2));

      if (orderId) {
        // Update order with payment info, customer details and shipping address from Stripe
        const { error } = await supabaseClient
          .from("orders")
          .update({
            status: "paid",
            stripe_session_id: session.id,
            customer_email: customerEmail || '',
            customer_name: customerName || null,
            customer_phone: customerPhone || null,
            shipping_address_line1: shippingAddress?.line1 || null,
            shipping_address_line2: shippingAddress?.line2 || null,
            shipping_postal_code: shippingAddress?.postal_code || null,
            shipping_city: shippingAddress?.city || null,
            shipping_country: shippingAddress?.country || 'DE',
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
            // Format shipping address
            const shippingAddressHtml = shippingAddress ? `
              <li><strong>Lieferadresse:</strong><br>
                ${shippingAddress.line1 || ''}<br>
                ${shippingAddress.line2 ? shippingAddress.line2 + '<br>' : ''}
                ${shippingAddress.postal_code || ''} ${shippingAddress.city || ''}<br>
                ${shippingAddress.country || ''}
              </li>
            ` : '';

            // Send confirmation to customer
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "LightPicture <bestellungen@lightpicture-3d.de>",
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
                    ${shippingAddressHtml}
                  </ul>
                  <p>Wir beginnen umgehend mit der Produktion Ihres personalisierten 3D-Bilderrahmens.</p>
                  <p>Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versendet wird.</p>
                  <p>Bei Fragen erreichen Sie uns unter versandhandellukaspfister@gmail.com</p>
                  <p>Viele Grüße,<br>Ihr LightPicture Team</p>
                `,
              }),
            });

            // Send internal notification to business owner
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "LightPicture <bestellungen@lightpicture-3d.de>",
                to: "versandhandellukaspfister@gmail.com",
                subject: `🆕 Neue Bestellung #${orderId.slice(0, 8)}`,
                html: `
                  <h1>Neue Bestellung eingegangen!</h1>
                  <h2>Bestelldetails:</h2>
                  <ul>
                    <li><strong>Bestellung-ID:</strong> ${orderId}</li>
                    <li><strong>Kurz-ID:</strong> ${orderId.slice(0, 8)}</li>
                    <li><strong>Status:</strong> Bezahlt</li>
                    <li><strong>Rahmenfarbe:</strong> ${order.frame_color === 'black' ? 'Schwarz' : 'Weiß'}</li>
                    <li><strong>Preis:</strong> 29,90 €</li>
                    <li><strong>Stripe Session:</strong> ${session.id}</li>
                  </ul>
                  <h2>Kundeninformationen:</h2>
                  <ul>
                    <li><strong>Name:</strong> ${order.customer_name || 'Nicht angegeben'}</li>
                    <li><strong>E-Mail:</strong> ${order.customer_email}</li>
                    ${customerPhone ? `<li><strong>Telefon:</strong> ${customerPhone}</li>` : ''}
                    ${shippingAddressHtml}
                  </ul>
                  <h2>Bild:</h2>
                  <p><a href="${order.image_url}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px;">📥 Bild herunterladen</a></p>
                  <img src="${order.image_url}" alt="Bestelltes Bild" style="max-width: 400px; margin-top: 20px; border: 1px solid #ddd; border-radius: 8px;" />
                  <hr style="margin: 30px 0;" />
                  <p style="color: #666; font-size: 12px;">Erstellt: ${new Date(order.created_at).toLocaleString('de-DE')}</p>
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
