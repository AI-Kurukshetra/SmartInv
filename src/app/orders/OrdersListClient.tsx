"use client";

import { useMemo, useState } from "react";

export type OrderListItem = {
  id: string;
  code: string;
  channel: string;
  customer: string;
  status: "Pending" | "Packed" | "Shipped";
  createdAt: string;
  itemCount: number;
  risk: "Low" | "Medium" | "High";
};

type Props = {
  orders: OrderListItem[];
};

const statusOptions: Array<OrderListItem["status"] | "All"> = ["All", "Pending", "Packed", "Shipped"];

export default function OrdersListClient({ orders }: Props) {
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = status === "All" || order.status === status;
      const matchesSearch =
        !search ||
        order.code.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  const exceptionQueue = filtered.filter((order) => order.risk !== "Low");

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Order Control</h2>
            <p className="mt-1 text-sm text-zinc-500">Monitor fulfillment status and exception risk.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <input
              className="w-56 rounded-full border border-zinc-200 px-4 py-2 text-sm"
              placeholder="Search order or customer"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm"
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
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">
                    <a className="text-zinc-900 underline-offset-4 hover:underline" href={`/orders/${order.id}`}>
                      {order.code}
                    </a>
                  </td>
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
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.risk === "High"
                          ? "bg-red-100 text-red-700"
                          : order.risk === "Medium"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {order.risk}
                    </span>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={6}>
                    No orders match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Exception Queue</h2>
        <p className="mt-1 text-sm text-zinc-500">Orders flagged for potential delays or low stock.</p>
        <div className="mt-4 space-y-3">
          {exceptionQueue.map((order) => (
            <div key={order.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-amber-950">{order.code}</p>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-amber-800">
                  {order.risk} risk
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-900">
                {order.customer} · {order.channel} · {order.status}
              </p>
            </div>
          ))}
          {!exceptionQueue.length ? <p className="text-sm text-zinc-500">No exceptions right now.</p> : null}
        </div>
      </section>
    </div>
  );
}
