"use client";

import { useMemo, useState } from "react";

export type InventoryLocation = {
  id: string;
  name: string;
};

export type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitCost: number;
  totalOnHand: number;
  lowStockCount: number;
};

type Props = {
  products: InventoryProduct[];
  categories: string[];
  locations: InventoryLocation[];
  locationTotals: Record<string, number>;
};

export default function InventoryListClient({ products, categories, locations, locationTotals }: Props) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search, products]);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Inventory Overview</h2>
            <p className="mt-1 text-sm text-zinc-500">Filter SKUs by category and monitor low-stock risk.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <input
              className="w-56 rounded-full border border-zinc-200 px-4 py-2 text-sm"
              placeholder="Search SKU or product"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {locations.map((location) => (
          <div key={location.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{location.name}</p>
            <p className="mt-3 text-2xl font-semibold">{locationTotals[location.id] ?? 0} units</p>
            <p className="mt-1 text-xs text-zinc-500">On-hand balance</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">On hand</th>
                <th className="px-4 py-3">Low stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">
                    <a className="text-zinc-900 underline-offset-4 hover:underline" href={`/inventory/${product.id}`}>
                      {product.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{product.sku}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.totalOnHand}</td>
                  <td className="px-4 py-3">
                    {product.lowStockCount ? (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                        {product.lowStockCount} locations
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900">
                        Healthy
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={5}>
                    No products match your filters.
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
