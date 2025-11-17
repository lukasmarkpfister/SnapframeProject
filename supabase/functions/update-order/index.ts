import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { orderId, status, trackingNumber } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "orderId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (status) {
      updateData.status = status;
    }

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    const { data, error } = await supabaseClient
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send status update email
    if (data && status && data.customer_email) {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        let emailSubject = "";
        let emailBody = "";

        if (status === "processing") {
          emailSubject = "Ihre Bestellung wird bearbeitet - LightPicture";
          emailBody = `
            <h1>Ihre Bestellung wird bearbeitet</h1>
            <p>Hallo ${data.customer_name || 'Kunde'},</p>
            <p>Wir haben mit der Produktion Ihres personalisierten 3D-Bilderrahmens begonnen.</p>
            <p><strong>Bestellung-ID:</strong> ${orderId.slice(0, 8)}</p>
            <p>Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versendet wird.</p>
            <p>Viele Grüße,<br>Ihr LightPicture Team</p>
          `;
        } else if (status === "shipped") {
          emailSubject = "Ihre Bestellung wurde versendet - LightPicture";
          emailBody = `
            <h1>Ihre Bestellung wurde versendet! 📦</h1>
            <p>Hallo ${data.customer_name || 'Kunde'},</p>
            <p>Ihr personalisierter 3D-Bilderrahmen ist auf dem Weg zu Ihnen!</p>
            <p><strong>Bestellung-ID:</strong> ${orderId.slice(0, 8)}</p>
            ${trackingNumber ? `<p><strong>Sendungsnummer:</strong> ${trackingNumber}</p>` : ''}
            <p>Die voraussichtliche Lieferzeit beträgt 2-3 Werktage.</p>
            <p>Bei Fragen erreichen Sie uns unter support@lightpicture-3d.com</p>
            <p>Viele Grüße,<br>Ihr LightPicture Team</p>
          `;
        } else if (status === "completed") {
          emailSubject = "Ihre Bestellung wurde zugestellt - LightPicture";
          emailBody = `
            <h1>Vielen Dank für Ihren Einkauf! ✅</h1>
            <p>Hallo ${data.customer_name || 'Kunde'},</p>
            <p>Ihre Bestellung wurde erfolgreich zugestellt.</p>
            <p><strong>Bestellung-ID:</strong> ${orderId.slice(0, 8)}</p>
            <p>Wir hoffen, Sie haben Freude an Ihrem LightPicture!</p>
            <p>Bei Fragen oder Feedback erreichen Sie uns unter support@lightpicture-3d.com</p>
            <p>Viele Grüße,<br>Ihr LightPicture Team</p>
          `;
        }

        if (emailSubject) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "LightPicture <bestellungen@lightpicture-3d.com>",
              to: data.customer_email,
              subject: emailSubject,
              html: emailBody,
            }),
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
