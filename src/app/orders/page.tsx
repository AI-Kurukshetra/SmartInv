import OrdersListClient, { OrderListItem } from "./OrdersListClient";
import { supabaseServer } from "@/lib/supabaseServer";

type OrderRow = {
  id: string;
  order_code: string;
  channel: string;
  customer: string;
  status: "Pending" | "Packed" | "Shipped";
  created_at: string;
};

type OrderItemRow = {
  order_id: string;
  product_id: string;
  qty: number;
};

type InventoryRow = {
  product_id: string;
  on_hand: number;
};

export default async function OrdersPage() {
  const [ordersRes, orderItemsRes, inventoryRes] = await Promise.all([
    supabaseServer.from("orders").select("id, order_code, channel, customer, status, created_at").order("created_at", {
      ascending: false,
    }),
    supabaseServer.from("order_items").select("order_id, product_id, qty"),
    supabaseServer.from("inventory").select("product_id, on_hand"),
  ]);

  const ordersData = (ordersRes.data ?? []) as OrderRow[];
  const orderItemsData = (orderItemsRes.data ?? []) as OrderItemRow[];
  const inventoryData = (inventoryRes.data ?? []) as InventoryRow[];

  const inventoryByProduct = inventoryData.reduce<Record<string, number>>((acc, row) => {
    acc[row.product_id] = (acc[row.product_id] ?? 0) + row.on_hand;
    return acc;
  }, {});

  const itemsByOrder = orderItemsData.reduce<Record<string, OrderItemRow[]>>((acc, item) => {
    acc[item.order_id] = acc[item.order_id] ? [...acc[item.order_id], item] : [item];
    return acc;
  }, {});

  const orders: OrderListItem[] = ordersData.map((order) => {
    const items = itemsByOrder[order.id] ?? [];
    const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
    const risk = items.some((item) => item.qty > (inventoryByProduct[item.product_id] ?? 0))
      ? "High"
      : order.status === "Pending"
        ? "Medium"
        : "Low";

    return {
      id: order.id,
      code: order.order_code,
      channel: order.channel,
      customer: order.customer,
      status: order.status,
      createdAt: new Date(order.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      itemCount,
      risk,
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Orders</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Order Control</h1>
        <p className="mt-2 text-sm text-zinc-600">Monitor fulfillment status and exception queues.</p>
      </header>

      <OrdersListClient orders={orders} />
    </div>
  );
}
