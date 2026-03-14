export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Workspace Controls</h1>
        <p className="mt-2 text-sm text-zinc-600">Roles, integrations, and operational preferences.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Notification Rules</h2>
          <div className="mt-4 space-y-4 text-sm text-zinc-600">
            <div className="flex items-center justify-between">
              <span>Low stock alerts</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Enabled
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Order SLA breaches</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Review
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Supplier delays</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Enabled
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Integrations</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-600">
            <div className="flex items-center justify-between">
              <span>Shopify</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                Planned
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>QuickBooks</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                Planned
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping APIs</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                Planned
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Roles and Permissions</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">Admin</td>
                <td className="px-4 py-3">Full</td>
                <td className="px-4 py-3 text-zinc-600">All modules, approvals, and configuration.</td>
              </tr>
              <tr className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">Ops Manager</td>
                <td className="px-4 py-3">Operational</td>
                <td className="px-4 py-3 text-zinc-600">Inventory, orders, and replenishment.</td>
              </tr>
              <tr className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">Warehouse Lead</td>
                <td className="px-4 py-3">Warehouse</td>
                <td className="px-4 py-3 text-zinc-600">Receiving, picking, and cycle counts.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
