import ClientAuth from "../ClientAuth";
import ClientStatus from "../ClientStatus";
import InventoryPanel, { UiLocation, UiProduct } from "../InventoryPanel";
import OrdersPanel, { UiOrder } from "../OrdersPanel";
import { supabaseServer } from "@/lib/supabaseServer";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit_cost: number;
};

type LocationRow = {
  id: string;
  name: string;
};

type InventoryRow = {
  product_id: string;
  location_id: string;
  on_hand: number;
  reorder_point: number;
};

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

export default async function Home() {
  const hasEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const [productsRes, locationsRes, inventoryRes, ordersRes, orderItemsRes] = await Promise.all([
    supabaseServer.from("products").select("id, name, sku, category, unit_cost"),
    supabaseServer.from("locations").select("id, name"),
    supabaseServer.from("inventory").select("product_id, location_id, on_hand, reorder_point"),
    supabaseServer.from("orders").select("id, order_code, channel, customer, status, created_at").order("created_at", {
      ascending: false,
    }),
    supabaseServer.from("order_items").select("order_id, product_id, qty"),
  ]);

  const errors = [
    productsRes.error,
    locationsRes.error,
    inventoryRes.error,
    ordersRes.error,
    orderItemsRes.error,
  ].filter(Boolean);

  const productsData = (productsRes.data ?? []) as ProductRow[];
  const locationsData = (locationsRes.data ?? []) as LocationRow[];
  const inventoryData = (inventoryRes.data ?? []) as InventoryRow[];
  const ordersData = (ordersRes.data ?? []) as OrderRow[];
  const orderItemsData = (orderItemsRes.data ?? []) as OrderItemRow[];

  const locations: UiLocation[] = locationsData.map((location) => ({
    id: location.id,
    name: location.name,
  }));

  const locationNameById = new Map(locationsData.map((location) => [location.id, location.name]));
  const inventoryByProduct = inventoryData.reduce<Record<string, InventoryRow[]>>((acc, row) => {
    acc[row.product_id] = acc[row.product_id] ? [...acc[row.product_id], row] : [row];
    return acc;
  }, {});

  const products: UiProduct[] = productsData.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    unitCost: product.unit_cost,
    locationStocks: (inventoryByProduct[product.id] ?? []).map((row) => ({
      locationId: row.location_id,
      location: locationNameById.get(row.location_id) ?? "Unknown",
      onHand: row.on_hand,
      reorderPoint: row.reorder_point,
    })),
  }));

  const orderItemsCount = orderItemsData.reduce<Record<string, number>>((acc, item) => {
    acc[item.order_id] = (acc[item.order_id] ?? 0) + item.qty;
    return acc;
  }, {});

  const orderQtyByProduct = orderItemsData.reduce<Record<string, number>>((acc, item) => {
    acc[item.product_id] = (acc[item.product_id] ?? 0) + item.qty;
    return acc;
  }, {});

  const orders: UiOrder[] = ordersData.map((order) => ({
    id: order.id,
    code: order.order_code,
    channel: order.channel,
    customer: order.customer,
    status: order.status,
    createdAt: new Date(order.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    itemCount: orderItemsCount[order.id] ?? 0,
  }));

  const totalOnHand = products.reduce(
    (sum, product) => sum + product.locationStocks.reduce((inner, stock) => inner + stock.onHand, 0),
    0,
  );
  const openOrders = orders.filter((order) => order.status !== "Shipped");
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const packedOrders = orders.filter((order) => order.status === "Packed").length;
  const shippedOrders = orders.filter((order) => order.status === "Shipped").length;
  const totalOrders = orders.length || 1;

  const inventoryValue = products.reduce((sum, product) => {
    const units = product.locationStocks.reduce((inner, stock) => inner + stock.onHand, 0);
    return sum + units * product.unitCost;
  }, 0);

  const lowStockItems = products.flatMap((product) =>
    product.locationStocks
      .filter((stock) => stock.onHand < stock.reorderPoint)
      .map((stock) => ({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        location: stock.location,
        onHand: stock.onHand,
        reorderPoint: stock.reorderPoint,
      })),
  );

  const topProducts = [...products]
    .map((product) => {
      const onHand = product.locationStocks.reduce((sum, stock) => sum + stock.onHand, 0);
      return {
        ...product,
        onHand,
        ordered: orderQtyByProduct[product.id] ?? 0,
      };
    })
    .sort((a, b) => b.ordered - a.ordered || b.onHand - a.onHand)
    .slice(0, 5);

  return (
    <div className="min-h-screen text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Smart Inventory and Order Management
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">OrderCare Operations Command</h1>
              <p className="mt-3 max-w-2xl text-base text-zinc-600">
                Unified view of stock, orders, and auto-reorder signals across multiple warehouses.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Demo mode - Live Supabase data
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Total SKUs</p>
            <p className="mt-3 text-3xl font-semibold">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">On-hand Units</p>
            <p className="mt-3 text-3xl font-semibold">{totalOnHand}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Open Orders</p>
            <p className="mt-3 text-3xl font-semibold">{openOrders.length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Inventory Value</p>
            <p className="mt-3 text-3xl font-semibold">{currency.format(inventoryValue)}</p>
          </div>
        </section>

        {!hasEnv || errors.length ? (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
            <h2 className="text-lg font-semibold">Data connection missing</h2>
            <p className="mt-2">
              Add your Supabase URL and anon key, then seed the database to show live data.
            </p>
            <div className="mt-4 text-xs text-red-800">
              {errors.map((error, index) => (
                <p key={`${error?.message ?? "error"}-${index}`}>{error?.message}</p>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Order Pipeline</h2>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                    {orders.length} total
                  </span>
                </div>
                <div className="mt-4 grid gap-4">
                  <div>
                    <div className="flex items-center justify-between text-sm text-zinc-600">
                      <span>Pending</span>
                      <span className="font-semibold text-zinc-900">{pendingOrders}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-amber-500"
                        style={{ width: `${Math.round((pendingOrders / totalOrders) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm text-zinc-600">
                      <span>Packed</span>
                      <span className="font-semibold text-zinc-900">{packedOrders}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.round((packedOrders / totalOrders) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm text-zinc-600">
                      <span>Shipped</span>
                      <span className="font-semibold text-zinc-900">{shippedOrders}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${Math.round((shippedOrders / totalOrders) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Risk Alerts</h2>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                    {lowStockItems.length} low stock
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {lowStockItems.slice(0, 4).map((item) => (
                    <div key={`${item.productId}-${item.location}`} className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                      <p className="text-sm font-semibold text-amber-950">{item.name}</p>
                      <p className="mt-1 text-xs text-amber-900">
                        {item.location} · {item.sku} · {item.onHand}/{item.reorderPoint}
                      </p>
                    </div>
                  ))}
                  {!lowStockItems.length ? <p className="text-sm text-zinc-500">No critical alerts today.</p> : null}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Top Products</h2>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">Last 30 days</span>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Ordered</th>
                        <th className="px-4 py-3">On hand</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-zinc-50">
                          <td className="px-4 py-3 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-zinc-500">{product.sku}</td>
                          <td className="px-4 py-3">{product.ordered}</td>
                          <td className="px-4 py-3 text-zinc-600">{product.onHand}</td>
                        </tr>
                      ))}
                      {!topProducts.length ? (
                        <tr>
                          <td className="px-4 py-6 text-sm text-zinc-500" colSpan={4}>
                            No order history yet.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <h2 className="text-xl font-semibold">Ops Insights</h2>
                <div className="mt-4 space-y-3 text-sm text-zinc-600">
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Stock health</span>
                      <span className="font-semibold text-zinc-900">72%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div className="h-2 w-[72%] rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Fulfillment velocity</span>
                      <span className="font-semibold text-zinc-900">64%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div className="h-2 w-[64%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Reorder compliance</span>
                      <span className="font-semibold text-zinc-900">81%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div className="h-2 w-[81%] rounded-full bg-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <InventoryPanel products={products} locations={locations} />
            <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <OrdersPanel orders={orders} />
              <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <h2 className="text-xl font-semibold">Integration Status</h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    Supabase auth is configured for GitHub. Use this panel to validate connectivity.
                  </p>
                  <ClientStatus />
                  <ClientAuth />
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
