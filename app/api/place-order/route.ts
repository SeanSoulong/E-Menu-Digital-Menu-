import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      itemId,
      quantity,
      productName,
      customerName,
      customerPhone,
      customerAddress,
      totalPrice,
    } = body;

    if (!itemId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Customer name and phone are required" },
        { status: 400 }
      );
    }

    // Get item details (do NOT deduct stock)
    const { data: item, error: fetchError } = await supabase
      .from("menu_items")
      .select("name_en, name_kh, price, stock_quantity")
      .eq("id", itemId)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch item" },
        { status: 500 }
      );
    }

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Log the order with status 'pending' (stock not deducted yet)
    const itemName = productName || item.name_en;
    const { error: orderError, data: orderData } = await supabase
      .from("orders")
      .insert([
        {
          item_id: itemId,
          item_name: itemName,
          quantity: quantity,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress || "",
          total_price: totalPrice || `$${(item.price * quantity).toFixed(2)}`,
          status: "pending",
        },
      ])
      .select();

    if (orderError) {
      console.error("Error logging order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Return success response WITHOUT warning message to users
    return NextResponse.json({
      success: true,
      order: orderData?.[0],
      message: "Order placed successfully! Awaiting admin confirmation.",
    });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
