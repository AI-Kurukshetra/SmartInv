create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique not null,
  category text not null,
  unit_cost numeric not null
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  location_id uuid references locations(id) on delete cascade,
  on_hand integer not null,
  reorder_point integer not null
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null,
  channel text not null,
  customer text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  qty integer not null
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  lead_time_days integer not null
);

create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references suppliers(id) on delete set null,
  status text not null,
  created_at timestamptz not null default now(),
  expected_at date
);

create table if not exists purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid references purchase_orders(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  qty integer not null,
  unit_cost numeric not null
);

alter table products disable row level security;
alter table locations disable row level security;
alter table inventory disable row level security;
alter table orders disable row level security;
alter table order_items disable row level security;
alter table suppliers disable row level security;
alter table purchase_orders disable row level security;
alter table purchase_order_items disable row level security;

truncate table
  purchase_order_items,
  purchase_orders,
  suppliers,
  order_items,
  orders,
  inventory,
  locations,
  products
restart identity cascade;

insert into locations (id, name) values
  ('11111111-1111-1111-1111-111111111111', 'Bengaluru WH'),
  ('22222222-2222-2222-2222-222222222222', 'Delhi WH'),
  ('33333333-3333-3333-3333-333333333333', 'Mumbai WH');

insert into products (id, name, sku, category, unit_cost) values
  ('aaaa1111-1111-1111-1111-111111111111', 'Aurora Ceramic Mug', 'AUR-MUG-12', 'Home', 6.5),
  ('aaaa2222-2222-2222-2222-222222222222', 'Slate Insulated Bottle', 'SLT-BTL-20', 'Outdoor', 12.75),
  ('aaaa3333-3333-3333-3333-333333333333', 'Tide Canvas Tote', 'TDE-TOT-01', 'Accessories', 4.25),
  ('aaaa4444-4444-4444-4444-444444444444', 'Pulse Hoodie', 'PLS-HOD-08', 'Apparel', 18.2),
  ('aaaa5555-5555-5555-5555-555555555555', 'Nova Bluetooth Speaker', 'NVA-SPK-11', 'Electronics', 22.9),
  ('aaaa6666-6666-6666-6666-666666666666', 'Orbit Desk Lamp', 'ORB-LMP-04', 'Home', 14.4),
  ('aaaa7777-7777-7777-7777-777777777777', 'Glow Yoga Mat', 'GLW-YGM-02', 'Fitness', 9.6),
  ('aaaa8888-8888-8888-8888-888888888888', 'Stride Running Cap', 'STR-CAP-07', 'Apparel', 5.2),
  ('aaaa9999-9999-9999-9999-999999999999', 'Craft Travel Kit', 'CRF-TRV-05', 'Travel', 7.9),
  ('bbbb1111-1111-1111-1111-111111111111', 'Echo Water Filter', 'ECH-WTR-09', 'Home', 11.1);

insert into inventory (product_id, location_id, on_hand, reorder_point) values
  ('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 42, 30),
  ('aaaa1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 18, 25),
  ('aaaa1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 26, 20),
  ('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 55, 40),
  ('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 9, 20),
  ('aaaa2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 31, 25),
  ('aaaa3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 64, 35),
  ('aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 31, 30),
  ('aaaa3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 22, 25),
  ('aaaa4444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 21, 25),
  ('aaaa4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 14, 20),
  ('aaaa4444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 17, 18),
  ('aaaa5555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 28, 20),
  ('aaaa5555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 11, 18),
  ('aaaa5555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 16, 15),
  ('aaaa6666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 37, 30),
  ('aaaa6666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 19, 24),
  ('aaaa6666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 15, 20),
  ('aaaa7777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 44, 30),
  ('aaaa7777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 23, 25),
  ('aaaa7777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 12, 20),
  ('aaaa8888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 33, 20),
  ('aaaa8888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 8, 15),
  ('aaaa8888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 14, 18),
  ('aaaa9999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 39, 28),
  ('aaaa9999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 16, 20),
  ('aaaa9999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 10, 18),
  ('bbbb1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 25, 18),
  ('bbbb1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 12, 16),
  ('bbbb1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 9, 15);

insert into orders (id, order_code, channel, customer, status, created_at) values
  ('c1111111-1111-1111-1111-111111111111', 'ORD-10421', 'Shopify', 'Aria Kapoor', 'Pending', '2026-03-14T10:15:00+05:30'),
  ('c2222222-2222-2222-2222-222222222222', 'ORD-10422', 'Amazon', 'Nolan Shah', 'Packed', '2026-03-14T09:42:00+05:30'),
  ('c3333333-3333-3333-3333-333333333333', 'ORD-10423', 'Wholesale', 'Verve Retail', 'Pending', '2026-03-13T17:05:00+05:30'),
  ('c4444444-4444-4444-4444-444444444444', 'ORD-10424', 'Shopify', 'Saira Malik', 'Shipped', '2026-03-13T14:12:00+05:30'),
  ('c5555555-5555-5555-5555-555555555555', 'ORD-10425', 'Amazon', 'Atlas Goods', 'Pending', '2026-03-13T12:40:00+05:30'),
  ('c6666666-6666-6666-6666-666666666666', 'ORD-10426', 'Shopify', 'Juno Traders', 'Packed', '2026-03-12T18:35:00+05:30'),
  ('c7777777-7777-7777-7777-777777777777', 'ORD-10427', 'Wholesale', 'Summit Co', 'Pending', '2026-03-12T11:20:00+05:30'),
  ('c8888888-8888-8888-8888-888888888888', 'ORD-10428', 'Shopify', 'Lina Dsouza', 'Shipped', '2026-03-11T16:10:00+05:30');

insert into order_items (order_id, product_id, qty) values
  ('c1111111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222', 3),
  ('c1111111-1111-1111-1111-111111111111', 'aaaa3333-3333-3333-3333-333333333333', 2),
  ('c2222222-2222-2222-2222-222222222222', 'aaaa4444-4444-4444-4444-444444444444', 2),
  ('c3333333-3333-3333-3333-333333333333', 'aaaa1111-1111-1111-1111-111111111111', 20),
  ('c3333333-3333-3333-3333-333333333333', 'aaaa2222-2222-2222-2222-222222222222', 8),
  ('c4444444-4444-4444-4444-444444444444', 'aaaa3333-3333-3333-3333-333333333333', 1),
  ('c5555555-5555-5555-5555-555555555555', 'aaaa5555-5555-5555-5555-555555555555', 4),
  ('c5555555-5555-5555-5555-555555555555', 'bbbb1111-1111-1111-1111-111111111111', 2),
  ('c6666666-6666-6666-6666-666666666666', 'aaaa8888-8888-8888-8888-888888888888', 6),
  ('c7777777-7777-7777-7777-777777777777', 'aaaa6666-6666-6666-6666-666666666666', 10),
  ('c7777777-7777-7777-7777-777777777777', 'aaaa7777-7777-7777-7777-777777777777', 8),
  ('c8888888-8888-8888-8888-888888888888', 'aaaa9999-9999-9999-9999-999999999999', 3);

insert into suppliers (id, name, email, lead_time_days) values
  ('d1111111-1111-1111-1111-111111111111', 'Nexa Supply Co', 'ops@nexasupply.com', 7),
  ('d2222222-2222-2222-2222-222222222222', 'Urban Peak Wholesale', 'hello@urbanpeak.co', 10),
  ('d3333333-3333-3333-3333-333333333333', 'Cascade Imports', 'support@cascadeimports.co', 14);

insert into purchase_orders (id, supplier_id, status, created_at, expected_at) values
  ('e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Open', '2026-03-13T09:15:00+05:30', '2026-03-20'),
  ('e2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'Sent', '2026-03-12T15:00:00+05:30', '2026-03-22'),
  ('e3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333', 'Received', '2026-03-10T11:30:00+05:30', '2026-03-17');

insert into purchase_order_items (purchase_order_id, product_id, qty, unit_cost) values
  ('e1111111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222', 40, 12.75),
  ('e1111111-1111-1111-1111-111111111111', 'aaaa8888-8888-8888-8888-888888888888', 60, 5.2),
  ('e2222222-2222-2222-2222-222222222222', 'aaaa4444-4444-4444-4444-444444444444', 30, 18.2),
  ('e2222222-2222-2222-2222-222222222222', 'aaaa9999-9999-9999-9999-999999999999', 50, 7.9),
  ('e3333333-3333-3333-3333-333333333333', 'aaaa1111-1111-1111-1111-111111111111', 25, 6.5);
