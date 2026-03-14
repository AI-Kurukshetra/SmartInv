import { supabaseServer } from "@/lib/supabaseServer";

type LocationRow = {
  id: string;
  name: string;
};

type InventoryRow = {
  location_id: string;
  on_hand: number;
  reorder_point: number;
};

export default async function WarehousesPage() {
  const [locationsRes, inventoryRes] = await Promise.all([
    supabaseServer.from("locations").select("id, name"),
    supabaseServer.from("inventory").select("location_id, on_hand, reorder_point"),
  ]);

  const locations = (locationsRes.data ?? []) as LocationRow[];
  const inventory = (inventoryRes.data ?? []) as InventoryRow[];

  const inventoryByLocation = inventory.reduce<Record<string, InventoryRow[]>>((acc, row) => {
    acc[row.location_id] = acc[row.location_id] ? [...acc[row.location_id], row] : [row];
    return acc;
  }, {});

  const locationStats = locations.map((location) => {
    const rows = inventoryByLocation[location.id] ?? [];
    const totalOnHand = rows.reduce((sum, row) => sum + row.on_hand, 0);
    const lowStock = rows.filter((row) => row.on_hand < row.reorder_point).length;
    const utilization = Math.min(100, Math.round((totalOnHand / 120) * 100));
    return { ...location, totalOnHand, lowStock, utilization };
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Warehouses</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Location Performance</h1>
        <p className="mt-2 text-sm text-zinc-600">Cycle counts, capacity, and transfer visibility.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {locationStats.map((location) => (
          <div key={location.id} className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{location.name}</p>
            <p className="mt-3 text-3xl font-semibold">{location.totalOnHand} units</p>
            <p className="mt-2 text-sm text-zinc-500">{location.lowStock} low-stock alerts</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Capacity utilization</span>
                <span className="font-semibold text-zinc-900">{location.utilization}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-zinc-100">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${location.utilization}%` }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Transfer Requests</h2>
        <p className="mt-1 text-sm text-zinc-500">No pending transfers. Use inventory module to initiate.</p>
      </section>
    </div>
  );
}
