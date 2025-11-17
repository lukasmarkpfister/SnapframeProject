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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Calculate 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Find pending orders older than 24 hours
    const { data: oldOrders, error: fetchError } = await supabaseClient
      .from("orders")
      .select("id, image_url")
      .eq("status", "pending")
      .lt("created_at", oneDayAgo.toISOString());

    if (fetchError) {
      console.error("Error fetching old orders:", fetchError);
      throw fetchError;
    }

    if (!oldOrders || oldOrders.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No old pending orders to clean up",
          deleted: 0 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${oldOrders.length} old pending orders to clean up`);

    // Delete associated images from storage
    let imagesDeleted = 0;
    for (const order of oldOrders) {
      if (order.image_url) {
        try {
          // Extract file path from signed URL
          const urlObj = new URL(order.image_url);
          const pathMatch = urlObj.pathname.match(/\/order-images\/(.+?)(\?|$)/);
          
          if (pathMatch && pathMatch[1]) {
            const filePath = decodeURIComponent(pathMatch[1]);
            const { error: storageError } = await supabaseClient.storage
              .from("order-images")
              .remove([filePath]);
            
            if (storageError) {
              console.error(`Error deleting image ${filePath}:`, storageError);
            } else {
              imagesDeleted++;
              console.log(`Deleted image: ${filePath}`);
            }
          }
        } catch (imageError) {
          console.error(`Error processing image for order ${order.id}:`, imageError);
        }
      }
    }

    // Delete old pending orders
    const { error: deleteError } = await supabaseClient
      .from("orders")
      .delete()
      .eq("status", "pending")
      .lt("created_at", oneDayAgo.toISOString());

    if (deleteError) {
      console.error("Error deleting old orders:", deleteError);
      throw deleteError;
    }

    console.log(`Cleanup complete: ${oldOrders.length} orders deleted, ${imagesDeleted} images deleted`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully cleaned up ${oldOrders.length} old pending orders`,
        ordersDeleted: oldOrders.length,
        imagesDeleted: imagesDeleted
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cleanup error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Cleanup failed" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
