import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get current stock
    const { data: item, error: fetchError } = await supabase
      .from("menu_items")
      .select("stock_quantity")
      .eq("id", itemId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch item" },
        { status: 500 }
      );
    }

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Update stock
    const newStock = item.stock_quantity + quantity;
    const { error: updateError } = await supabase
      .from("menu_items")
      .update({
        stock_quantity: newStock,
        is_available: true,
      })
      .eq("id", itemId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update stock" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      newStock,
      message: `Restocked ${quantity} items. New stock: ${newStock}`,
    });
  } catch (error) {
    console.error("Error restocking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
