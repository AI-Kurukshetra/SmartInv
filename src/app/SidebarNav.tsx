"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/inventory", label: "Inventory" },
  { href: "/app/orders", label: "Orders" },
  { href: "/app/replenishment", label: "Replenishment" },
  { href: "/app/warehouses", label: "Warehouses" },
  { href: "/app/suppliers", label: "Suppliers" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/settings", label: "Settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="relative z-30 mt-8 flex flex-1 flex-col gap-1 overflow-y-auto pr-1 text-sm font-medium text-zinc-600 pointer-events-auto">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative z-30 rounded-xl px-3 py-2 transition-colors pointer-events-auto ${
              active ? "bg-zinc-100 text-zinc-900" : "hover:bg-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
