"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type LowStockItem = {
  productId: string;
  name: string;
  sku: string;
  location: string;
  onHand: number;
  reorderPoint: number;
  unitCost: number;
  suggestedQty: number;
};

type Supplier = {
  id: string;
  name: string;
  leadTimeDays: number;
};

type PurchaseOrder = {
  id: string;
  status: string;
  supplier: string;
  createdAt: string;
  expectedAt: string | null;
};

type Props = {
  lowStockItems: LowStockItem[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
};

export default function ReplenishmentClient({ lowStockItems, suppliers, purchaseOrders }: Props) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? "");
  const [message, setMessage] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const handleGenerate = async () => {
    if (!supplierId || !lowStockItems.length) return;
    setBusy(true);
    setMessage("");

    const expectedAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const { data: po, error: poError } = await supabase
      .from("purchase_orders")
      .insert({ supplier_id: supplierId, status: "Open", expected_at: expectedAt })
      .select("id")
      .single();

    if (poError || !po) {
      setMessage(poError?.message ?? "Failed to create PO.");
      setBusy(false);
      return;
    }

    const items = lowStockItems.map((item) => ({
      purchase_order_id: po.id,
      product_id: item.productId,
      qty: item.suggestedQty,
      unit_cost: item.unitCost,
    }));

    const { error: itemError } = await supabase.from("purchase_order_items").insert(items);
    if (itemError) {
      setMessage(itemError.message);
    } else {
      setMessage("Purchase order created. Refresh to see it in the tracker.");
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Reorder Suggestions</h2>
            <p className="mt-1 text-sm text-zinc-500">Low-stock items with recommended purchase quantities.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <select
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm"
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
            >
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <button
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              onClick={handleGenerate}
              disabled={busy || !lowStockItems.length}
            >
              Generate PO
            </button>
          </div>
        </div>
        {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">On hand</th>
                <th className="px-4 py-3">Reorder</th>
                <th className="px-4 py-3">Suggested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {lowStockItems.map((item) => (
                <tr key={`${item.productId}-${item.location}`} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{item.sku}</td>
                  <td className="px-4 py-3">{item.location}</td>
                  <td className="px-4 py-3">{item.onHand}</td>
                  <td className="px-4 py-3">{item.reorderPoint}</td>
                  <td className="px-4 py-3 font-semibold">{item.suggestedQty}</td>
                </tr>
              ))}
              {!lowStockItems.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={6}>
                    No low-stock items right now.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Purchase Order Tracker</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">PO</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Expected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{po.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">{po.supplier}</td>
                  <td className="px-4 py-3">{po.status}</td>
                  <td className="px-4 py-3 text-zinc-500">{po.createdAt}</td>
                  <td className="px-4 py-3 text-zinc-500">{po.expectedAt ?? "-"}</td>
                </tr>
              ))}
              {!purchaseOrders.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={5}>
                    No purchase orders found.
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
