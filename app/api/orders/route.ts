/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders, count });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the order first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // If confirming order - DEDUCT STOCK HERE
    if (status === "confirmed" && order.status !== "confirmed") {
      // Get current stock
      const { data: item, error: itemError } = await supabase
        .from("menu_items")
        .select("stock_quantity, name_en")
        .eq("id", order.item_id)
        .single();

      if (itemError) {
        return NextResponse.json({ error: itemError.message }, { status: 500 });
      }

      // Check if enough stock
      if (item.stock_quantity < order.quantity) {
        return NextResponse.json(
          {
            error: `Not enough stock! Only ${item.stock_quantity} items left.`,
          },
          { status: 400 }
        );
      }

      // Deduct stock
      const newStock = item.stock_quantity - order.quantity;
      const { error: updateStockError } = await supabase
        .from("menu_items")
        .update({
          stock_quantity: newStock,
          is_available: newStock > 0,
        })
        .eq("id", order.item_id);

      if (updateStockError) {
        return NextResponse.json(
          { error: updateStockError.message },
          { status: 500 }
        );
      }
    }

    // If cancelling order and it was confirmed, restore stock
    if (status === "cancelled" && order.status === "confirmed") {
      const { data: item, error: itemError } = await supabase
        .from("menu_items")
        .select("stock_quantity")
        .eq("id", order.item_id)
        .single();

      if (!itemError && item) {
        const newStock = item.stock_quantity + order.quantity;
        await supabase
          .from("menu_items")
          .update({
            stock_quantity: newStock,
            is_available: true,
          })
          .eq("id", order.item_id);
      }
    }

    // Update order status
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if order is confirmed - if so, restore stock before deleting
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // If order was confirmed, restore stock
    if (order.status === "confirmed") {
      const { data: item, error: itemError } = await supabase
        .from("menu_items")
        .select("stock_quantity")
        .eq("id", order.item_id)
        .single();

      if (!itemError && item) {
        const newStock = item.stock_quantity + order.quantity;
        await supabase
          .from("menu_items")
          .update({ stock_quantity: newStock })
          .eq("id", order.item_id);
      }
    }

    // Delete the order
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      customer_name,
      customer_phone,
      customer_address,
      quantity,
    } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const updateData: any = {};
    if (customer_name) updateData.customer_name = customer_name;
    if (customer_phone) updateData.customer_phone = customer_phone;
    if (customer_address !== undefined)
      updateData.customer_address = customer_address;
    if (quantity) updateData.quantity = quantity;

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
