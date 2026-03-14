"use client";

import { useMemo, useState } from "react";

export type UiLocation = {
  id: string;
  name: string;
};

export type UiStock = {
  locationId: string;
  location: string;
  onHand: number;
  reorderPoint: number;
};

export type UiProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitCost: number;
  locationStocks: UiStock[];
};

type Props = {
  products: UiProduct[];
  locations: UiLocation[];
};

export default function InventoryPanel({ products, locations }: Props) {
  const [locationId, setLocationId] = useState<string>("all");

  const locationMap = useMemo(() => {
    const map = new Map<string, string>();
    locations.forEach((loc) => map.set(loc.id, loc.name));
    return map;
  }, [locations]);

  const filteredProducts = useMemo(() => {
    if (locationId === "all") return products;
    return products
      .map((product) => ({
        ...product,
        locationStocks: product.locationStocks.filter((stock) => stock.locationId === locationId),
      }))
      .filter((product) => product.locationStocks.length > 0);
  }, [locationId, products]);

  const lowStockItems = useMemo(() => {
    return filteredProducts.flatMap((product) =>
      product.locationStocks
        .filter((stock) => stock.onHand < stock.reorderPoint)
        .map((stock) => ({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          location: stock.location,
          onHand: stock.onHand,
          reorderPoint: stock.reorderPoint,
          suggestedQty: Math.max(stock.reorderPoint * 2 - stock.onHand, 0),
        })),
    );
  }, [filteredProducts]);

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Inventory by Location</h2>
            <p className="mt-1 text-sm text-zinc-500">Real-time stock view for multi-warehouse operations.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span>Location</span>
            <select
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700"
              value={locationId}
              onChange={(event) => setLocationId(event.target.value)}
            >
              <option value="all">All</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Locations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{product.sku}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {product.locationStocks.map((stock) => {
                        const low = stock.onHand < stock.reorderPoint;
                        return (
                          <span
                            key={`${product.id}-${stock.locationId}`}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              low
                                ? "border-amber-200 bg-amber-50 text-amber-900"
                                : "border-zinc-200 bg-zinc-50 text-zinc-700"
                            }`}
                          >
                            {stock.location}: {stock.onHand} / RP {stock.reorderPoint}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredProducts.length ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-zinc-500" colSpan={4}>
                    No inventory found for {locationMap.get(locationId) ?? "this location"}.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Auto-Reorder Alerts</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            {lowStockItems.length} alerts
          </span>
        </div>
        <div className="mt-4 space-y-4">
          {lowStockItems.map((item) => (
            <div key={`${item.productId}-${item.location}`} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-950">{item.name}</p>
              <p className="mt-1 text-xs text-amber-900">
                {item.location} · {item.sku}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-amber-900">
                <span>
                  On hand {item.onHand} / Reorder {item.reorderPoint}
                </span>
                <span className="rounded-full bg-white px-2 py-1 font-semibold text-amber-800">
                  Suggest PO: {item.suggestedQty}
                </span>
              </div>
            </div>
          ))}
          {!lowStockItems.length ? <p className="text-sm text-zinc-500">All locations healthy.</p> : null}
        </div>
      </div>
    </section>
  );
}
