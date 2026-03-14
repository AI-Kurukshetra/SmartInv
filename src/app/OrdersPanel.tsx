"use client";

import { useMemo, useState } from "react";

export type UiOrder = {
  id: string;
  code: string;
  channel: string;
  customer: string;
  status: "Pending" | "Packed" | "Shipped";
  createdAt: string;
  itemCount: number;
};

type Props = {
  orders: UiOrder[];
};

const statusOptions: Array<UiOrder["status"] | "All"> = ["All", "Pending", "Packed", "Shipped"];

export default function OrdersPanel({ orders }: Props) {
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All");

  const filteredOrders = useMemo(() => {
    if (status === "All") return orders;
    return orders.filter((order) => order.status === status);
  }, [orders, status]);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Order Control Center</h2>
          <p className="mt-1 text-sm text-zinc-500">Track fulfillment status across channels.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <span>Status</span>
          <select
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{order.code}</td>
                <td className="px-4 py-3">{order.channel}</td>
                <td className="px-4 py-3 text-zinc-600">{order.customer}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "Shipped"
                        ? "bg-zinc-100 text-zinc-600"
                        : order.status === "Packed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600">{order.itemCount}</td>
                <td className="px-4 py-3 text-zinc-500">{order.createdAt}</td>
              </tr>
            ))}
            {!filteredOrders.length ? (
              <tr>
                <td className="px-4 py-6 text-sm text-zinc-500" colSpan={6}>
                  No orders in this status.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
