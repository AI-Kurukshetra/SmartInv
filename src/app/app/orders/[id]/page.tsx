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
  qty: number;
  products: { name: string; sku: string }[] | null;
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = params.id;

  const [orderRes, itemsRes] = await Promise.all([
    supabaseServer
      .from("orders")
      .select("id, order_code, channel, customer, status, created_at")
      .eq("id", orderId)
      .single(),
    supabaseServer
      .from("order_items")
      .select("qty, products(name, sku)")
      .eq("order_id", orderId),
  ]);

  const order = orderRes.data as OrderRow | null;
  const items = (itemsRes.data ?? []) as OrderItemRow[];

  if (!order) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-semibold text-zinc-900">Order not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Orders</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">{order.order_code}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {order.customer} · {order.channel} · {new Date(order.created_at).toLocaleString("en-IN")}
        </p>
      </header>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Items</h2>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
            {order.status}
          </span>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((item, index) => (
                <tr key={`${item.products?.[0]?.sku ?? "sku"}-${index}`} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{item.products?.[0]?.name ?? "Unknown"}</td>
                  <td className="px-4 py-3 text-zinc-500">{item.products?.[0]?.sku ?? "-"}</td>
                  <td className="px-4 py-3">{item.qty}</td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={3}>
                    No items for this order.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
