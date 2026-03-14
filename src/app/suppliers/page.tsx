import { supabaseServer } from "@/lib/supabaseServer";

type SupplierRow = {
  id: string;
  name: string;
  email: string | null;
  lead_time_days: number;
};

type PurchaseOrderRow = {
  supplier_id: string | null;
  status: string;
};

export default async function SuppliersPage() {
  const [suppliersRes, purchaseOrdersRes] = await Promise.all([
    supabaseServer.from("suppliers").select("id, name, email, lead_time_days"),
    supabaseServer.from("purchase_orders").select("supplier_id, status"),
  ]);

  const suppliers = (suppliersRes.data ?? []) as SupplierRow[];
  const purchaseOrders = (purchaseOrdersRes.data ?? []) as PurchaseOrderRow[];

  const poBySupplier = purchaseOrders.reduce<Record<string, { open: number; total: number }>>((acc, po) => {
    if (!po.supplier_id) return acc;
    const entry = acc[po.supplier_id] ?? { open: 0, total: 0 };
    entry.total += 1;
    if (po.status !== "Received") entry.open += 1;
    acc[po.supplier_id] = entry;
    return acc;
  }, {});

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Suppliers</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Supplier Scorecards</h1>
        <p className="mt-2 text-sm text-zinc-600">Lead time reliability and vendor performance.</p>
      </header>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Lead time</th>
                <th className="px-4 py-3">Open POs</th>
                <th className="px-4 py-3">Total POs</th>
                <th className="px-4 py-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {suppliers.map((supplier) => {
                const poStats = poBySupplier[supplier.id] ?? { open: 0, total: 0 };
                return (
                  <tr key={supplier.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium">{supplier.name}</td>
                    <td className="px-4 py-3 text-zinc-600">{supplier.lead_time_days} days</td>
                    <td className="px-4 py-3">{poStats.open}</td>
                    <td className="px-4 py-3">{poStats.total}</td>
                    <td className="px-4 py-3 text-zinc-500">{supplier.email ?? "N/A"}</td>
                  </tr>
                );
              })}
              {!suppliers.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={5}>
                    No suppliers configured.
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
