import { supabaseServer } from "@/lib/supabaseServer";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit_cost: number;
};

type InventoryRow = {
  location_id: string;
  on_hand: number;
  reorder_point: number;
  locations: { name: string }[] | null;
};

type OrderItemRow = {
  qty: number;
  orders: { order_code: string; created_at: string; customer: string }[] | null;
};

type PurchaseItemRow = {
  qty: number;
  unit_cost: number;
  purchase_orders: { created_at: string; status: string; supplier_id: string | null }[] | null;
};

type SupplierRow = {
  id: string;
  name: string;
};

export default async function InventoryDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  const [productRes, inventoryRes, orderItemsRes, purchaseItemsRes, suppliersRes] = await Promise.all([
    supabaseServer.from("products").select("id, name, sku, category, unit_cost").eq("id", productId).single(),
    supabaseServer
      .from("inventory")
      .select("location_id, on_hand, reorder_point, locations(name)")
      .eq("product_id", productId),
    supabaseServer
      .from("order_items")
      .select("qty, orders(order_code, created_at, customer)")
      .eq("product_id", productId),
    supabaseServer
      .from("purchase_order_items")
      .select("qty, unit_cost, purchase_orders(created_at, status, supplier_id)")
      .eq("product_id", productId),
    supabaseServer.from("suppliers").select("id, name"),
  ]);

  const product = productRes.data as ProductRow | null;
  const inventoryRows = (inventoryRes.data ?? []) as InventoryRow[];
  const orderItems = (orderItemsRes.data ?? []) as OrderItemRow[];
  const purchaseItems = (purchaseItemsRes.data ?? []) as PurchaseItemRow[];
  const suppliers = (suppliersRes.data ?? []) as SupplierRow[];

  if (!product) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <h1 className="text-2xl font-semibold text-zinc-900">SKU not found</h1>
      </div>
    );
  }

  const supplierNameById = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]));

  const movements = [
    ...orderItems.map((item) => ({
      type: "Order",
      date: item.orders?.[0]?.created_at ?? "",
      ref: item.orders?.[0]?.order_code ?? "Order",
      qty: -item.qty,
      note: item.orders?.[0]?.customer ?? "",
    })),
    ...purchaseItems.map((item) => ({
      type: "Purchase",
      date: item.purchase_orders?.[0]?.created_at ?? "",
      ref: item.purchase_orders?.[0]?.status ?? "PO",
      qty: item.qty,
      note:
        item.purchase_orders?.[0]?.supplier_id
          ? supplierNameById.get(item.purchase_orders[0].supplier_id) ?? ""
          : "",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalOnHand = inventoryRows.reduce((sum, row) => sum + row.on_hand, 0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Inventory</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">{product.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {product.sku} · {product.category}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">On-hand units</p>
          <p className="mt-3 text-2xl font-semibold">{totalOnHand}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Unit cost</p>
          <p className="mt-3 text-2xl font-semibold">₹{product.unit_cost}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Locations</p>
          <p className="mt-3 text-2xl font-semibold">{inventoryRows.length}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Stock by Location</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">On hand</th>
                <th className="px-4 py-3">Reorder point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {inventoryRows.map((row) => (
                <tr key={row.location_id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{row.locations?.[0]?.name ?? "Unknown"}</td>
                  <td className="px-4 py-3">{row.on_hand}</td>
                  <td className="px-4 py-3">{row.reorder_point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Movement Log</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {movements.map((move, index) => (
                <tr key={`${move.type}-${index}`} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 text-zinc-500">{new Date(move.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3">{move.type}</td>
                  <td className="px-4 py-3 text-zinc-600">{move.ref}</td>
                  <td className={`px-4 py-3 font-semibold ${move.qty < 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {move.qty}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{move.note}</td>
                </tr>
              ))}
              {!movements.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={5}>
                    No movements recorded yet.
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
