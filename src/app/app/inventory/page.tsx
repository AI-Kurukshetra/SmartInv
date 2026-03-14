import InventoryListClient, { InventoryLocation, InventoryProduct } from "./InventoryListClient";
import { supabaseServer } from "@/lib/supabaseServer";

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

export default async function InventoryPage() {
  const [productsRes, locationsRes, inventoryRes] = await Promise.all([
    supabaseServer.from("products").select("id, name, sku, category, unit_cost"),
    supabaseServer.from("locations").select("id, name"),
    supabaseServer.from("inventory").select("product_id, location_id, on_hand, reorder_point"),
  ]);

  const productsData = (productsRes.data ?? []) as ProductRow[];
  const locationsData = (locationsRes.data ?? []) as LocationRow[];
  const inventoryData = (inventoryRes.data ?? []) as InventoryRow[];

  const locationTotals = inventoryData.reduce<Record<string, number>>((acc, row) => {
    acc[row.location_id] = (acc[row.location_id] ?? 0) + row.on_hand;
    return acc;
  }, {});

  const inventoryByProduct = inventoryData.reduce<Record<string, InventoryRow[]>>((acc, row) => {
    acc[row.product_id] = acc[row.product_id] ? [...acc[row.product_id], row] : [row];
    return acc;
  }, {});

  const products: InventoryProduct[] = productsData.map((product) => {
    const rows = inventoryByProduct[product.id] ?? [];
    const totalOnHand = rows.reduce((sum, row) => sum + row.on_hand, 0);
    const lowStockCount = rows.filter((row) => row.on_hand < row.reorder_point).length;
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      unitCost: product.unit_cost,
      totalOnHand,
      lowStockCount,
    };
  });

  const categories = Array.from(new Set(products.map((product) => product.category))).sort();
  const locations: InventoryLocation[] = locationsData.map((location) => ({ id: location.id, name: location.name }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Inventory</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Stock Overview</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Search, filter, and drill into SKU-level movements and warehouse balances.
        </p>
      </header>

      <InventoryListClient
        products={products}
        categories={categories}
        locations={locations}
        locationTotals={locationTotals}
      />
    </div>
  );
}
