import SidebarNav from "../SidebarNav";
import AppShell from "./AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <div className="flex min-h-screen">
        <aside className="relative z-20 hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white px-5 py-8 lg:flex pointer-events-auto">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">OrderCare</p>
            <p className="mt-2 text-lg font-semibold text-zinc-900">Operations Command</p>
          </div>
          <SidebarNav />
          <div className="mt-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
            <p className="font-semibold text-zinc-900">Demo Environment</p>
            <p className="mt-1">Live Supabase seed data.</p>
          </div>
        </aside>

        <div className="relative z-0 flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Smart Inventory</p>
              <p className="text-lg font-semibold text-zinc-900">Ops Control Center</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">India Operations</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-900">
                Healthy
              </span>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AppShell>
  );
}
