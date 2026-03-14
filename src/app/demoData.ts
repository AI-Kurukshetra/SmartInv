export type LocationStock = {
  location: string;
  onHand: number;
  reorderPoint: number;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitCost: number;
  locationStocks: LocationStock[];
};

export type OrderItem = {
  productId: string;
  qty: number;
};

export type Order = {
  id: string;
  channel: "Shopify" | "Amazon" | "Wholesale";
  customer: string;
  status: "Pending" | "Packed" | "Shipped";
  createdAt: string;
  items: OrderItem[];
};

export const products: Product[] = [
  {
    id: "prod_aurora_mug",
    name: "Aurora Ceramic Mug",
    sku: "AUR-MUG-12",
    category: "Home",
    unitCost: 6.5,
    locationStocks: [
      { location: "Bengaluru WH", onHand: 42, reorderPoint: 30 },
      { location: "Delhi WH", onHand: 18, reorderPoint: 25 },
    ],
  },
  {
    id: "prod_slate_bottle",
    name: "Slate Insulated Bottle",
    sku: "SLT-BTL-20",
    category: "Outdoor",
    unitCost: 12.75,
    locationStocks: [
      { location: "Bengaluru WH", onHand: 55, reorderPoint: 40 },
      { location: "Delhi WH", onHand: 9, reorderPoint: 20 },
    ],
  },
  {
    id: "prod_tide_tote",
    name: "Tide Canvas Tote",
    sku: "TDE-TOT-01",
    category: "Accessories",
    unitCost: 4.25,
    locationStocks: [
      { location: "Bengaluru WH", onHand: 64, reorderPoint: 35 },
      { location: "Delhi WH", onHand: 31, reorderPoint: 30 },
    ],
  },
  {
    id: "prod_pulse_hoodie",
    name: "Pulse Hoodie",
    sku: "PLS-HOD-08",
    category: "Apparel",
    unitCost: 18.2,
    locationStocks: [
      { location: "Bengaluru WH", onHand: 21, reorderPoint: 25 },
      { location: "Delhi WH", onHand: 14, reorderPoint: 20 },
    ],
  },
];

export const orders: Order[] = [
  {
    id: "ord_10421",
    channel: "Shopify",
    customer: "Aria Kapoor",
    status: "Pending",
    createdAt: "2026-03-14 10:15",
    items: [
      { productId: "prod_slate_bottle", qty: 3 },
      { productId: "prod_tide_tote", qty: 2 },
    ],
  },
  {
    id: "ord_10422",
    channel: "Amazon",
    customer: "Nolan Shah",
    status: "Packed",
    createdAt: "2026-03-14 09:42",
    items: [{ productId: "prod_pulse_hoodie", qty: 2 }],
  },
  {
    id: "ord_10423",
    channel: "Wholesale",
    customer: "Verve Retail",
    status: "Pending",
    createdAt: "2026-03-13 17:05",
    items: [
      { productId: "prod_aurora_mug", qty: 20 },
      { productId: "prod_slate_bottle", qty: 8 },
    ],
  },
  {
    id: "ord_10424",
    channel: "Shopify",
    customer: "Saira Malik",
    status: "Shipped",
    createdAt: "2026-03-13 14:12",
    items: [{ productId: "prod_tide_tote", qty: 1 }],
  },
];
