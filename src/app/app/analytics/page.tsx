import { supabaseServer } from "@/lib/supabaseServer";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  unit_cost: number;
};

type InventoryRow = {
  product_id: string;
  on_hand: number;
  reorder_point: number;
};

type OrderItemRow = {
  product_id: string;
  qty: number;
};

export default async function AnalyticsPage() {
  const [productsRes, inventoryRes, orderItemsRes] = await Promise.all([
    supabaseServer.from("products").select("id, name, sku, unit_cost"),
    supabaseServer.from("inventory").select("product_id, on_hand, reorder_point"),
    supabaseServer.from("order_items").select("product_id, qty"),
  ]);

  const products = (productsRes.data ?? []) as ProductRow[];
  const inventory = (inventoryRes.data ?? []) as InventoryRow[];
  const orderItems = (orderItemsRes.data ?? []) as OrderItemRow[];

  const onHandByProduct = inventory.reduce<Record<string, number>>((acc, row) => {
    acc[row.product_id] = (acc[row.product_id] ?? 0) + row.on_hand;
    return acc;
  }, {});

  const orderedByProduct = orderItems.reduce<Record<string, number>>((acc, row) => {
    acc[row.product_id] = (acc[row.product_id] ?? 0) + row.qty;
    return acc;
  }, {});

  const totalOnHand = inventory.reduce((sum, row) => sum + row.on_hand, 0);
  const totalOrdered = orderItems.reduce((sum, row) => sum + row.qty, 0);
  const inventoryTurns = totalOnHand ? (totalOrdered / totalOnHand).toFixed(2) : "0.00";
  const stockoutRate =
    inventory.length === 0
      ? 0
      : Math.round(
          (inventory.filter((row) => row.on_hand < row.reorder_point).length / inventory.length) * 100,
        );

  const topDemand = [...products]
    .map((product) => ({
      id: product.id,
      name: product.name,
      ordered: orderedByProduct[product.id] ?? 0,
    }))
    .sort((a, b) => b.ordered - a.ordered)
    .slice(0, 6);

  const marginRows = [...products]
    .map((product) => {
      const sellPrice = product.unit_cost * 2.6;
      const marginPct = ((sellPrice - product.unit_cost) / sellPrice) * 100;
      return { ...product, marginPct };
    })
    .sort((a, b) => b.marginPct - a.marginPct)
    .slice(0, 5);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Operational Insights</h1>
        <p className="mt-2 text-sm text-zinc-600">Inventory turns, demand signals, and margin analysis.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Inventory turns</p>
          <p className="mt-3 text-3xl font-semibold">{inventoryTurns}x</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Stockout risk</p>
          <p className="mt-3 text-3xl font-semibold">{stockoutRate}%</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Units ordered</p>
          <p className="mt-3 text-3xl font-semibold">{totalOrdered}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Demand Signal (Last 30 days)</h2>
          <div className="mt-4 space-y-3">
            {topDemand.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>{item.name}</span>
                  <span className="font-semibold text-zinc-900">{item.ordered}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-zinc-100">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${Math.min(100, item.ordered * 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Gross Margin by SKU</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-600">
            {marginRows.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="font-semibold text-zinc-900">{item.marginPct.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-zinc-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.marginPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
