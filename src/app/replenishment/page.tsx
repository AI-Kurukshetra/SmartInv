import { supabaseServer } from "@/lib/supabaseServer";
import ReplenishmentClient from "./ReplenishmentClient";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  unit_cost: number;
};

type InventoryRow = {
  product_id: string;
  location_id: string;
  on_hand: number;
  reorder_point: number;
  locations: { name: string }[] | null;
};

type SupplierRow = {
  id: string;
  name: string;
  lead_time_days: number;
};

type PurchaseOrderRow = {
  id: string;
  status: string;
  created_at: string;
  expected_at: string | null;
  suppliers: { name: string }[] | null;
};

export default async function ReplenishmentPage() {
  const [productsRes, inventoryRes, suppliersRes, purchaseOrdersRes] = await Promise.all([
    supabaseServer.from("products").select("id, name, sku, unit_cost"),
    supabaseServer
      .from("inventory")
      .select("product_id, location_id, on_hand, reorder_point, locations(name)"),
    supabaseServer.from("suppliers").select("id, name, lead_time_days"),
    supabaseServer
      .from("purchase_orders")
      .select("id, status, created_at, expected_at, suppliers(name)")
      .order("created_at", { ascending: false }),
  ]);

  const products = (productsRes.data ?? []) as ProductRow[];
  const inventory = (inventoryRes.data ?? []) as InventoryRow[];
  const suppliers = ((suppliersRes.data ?? []) as SupplierRow[]).map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
    leadTimeDays: supplier.lead_time_days,
  }));
  const purchaseOrders = (purchaseOrdersRes.data ?? []) as PurchaseOrderRow[];

  const productById = new Map(products.map((product) => [product.id, product]));

  const lowStockItems = inventory
    .filter((row) => row.on_hand < row.reorder_point)
    .map((row) => {
      const product = productById.get(row.product_id);
      const suggestedQty = Math.max(row.reorder_point * 2 - row.on_hand, 0);
      return {
        productId: row.product_id,
        name: product?.name ?? "Unknown",
        sku: product?.sku ?? "-",
        location: row.locations?.[0]?.name ?? "Unknown",
        onHand: row.on_hand,
        reorderPoint: row.reorder_point,
        unitCost: product?.unit_cost ?? 0,
        suggestedQty,
      };
    });

  const purchaseOrderList = purchaseOrders.map((po) => ({
    id: po.id,
    status: po.status,
    supplier: po.suppliers?.[0]?.name ?? "Unassigned",
    createdAt: new Date(po.created_at).toLocaleDateString("en-IN"),
    expectedAt: po.expected_at,
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Replenishment</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Reorder Center</h1>
        <p className="mt-2 text-sm text-zinc-600">Automated reorder suggestions and purchase order tracking.</p>
      </header>

      <ReplenishmentClient lowStockItems={lowStockItems} suppliers={suppliers} purchaseOrders={purchaseOrderList} />
    </div>
  );
}
