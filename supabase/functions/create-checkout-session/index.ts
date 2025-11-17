import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      return new Response(
        JSON.stringify({
          error: "Stripe is not configured. Please add your STRIPE_SECRET_KEY."
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { origin, orderId, imageUrl, frameColor } = await req.json();

    const params: Record<string, string> = {
      "payment_method_types[0]": "card",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": "2990",
      "line_items[0][price_data][product_data][name]": `LightPicture - ${frameColor === 'black' ? 'Schwarzer' : 'Weißer'} Rahmen`,
      "line_items[0][price_data][product_data][description]": "3D-gedruckter beleuchteter Bilderrahmen mit Ihrem personalisierten Bild",
      "line_items[0][quantity]": "1",
      "mode": "payment",
      "success_url": `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      "cancel_url": `${origin}/cancel`,
    };

    // Add product image if available
    if (imageUrl) {
      params["line_items[0][price_data][product_data][images][0]"] = imageUrl;
    }

    if (orderId) {
      params["metadata[order_id]"] = orderId;
    }
    if (imageUrl) {
      params["metadata[image_url]"] = imageUrl;
    }
    if (frameColor) {
      params["metadata[frame_color]"] = frameColor;
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      throw new Error(session.error?.message || "Failed to create checkout session");
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
