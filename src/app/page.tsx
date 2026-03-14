export default function LandingPage() {
  return (
    <div className="min-h-screen text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">OrderCare</p>
            <p className="text-lg font-semibold text-zinc-900">Operations Command</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
            <a className="hover:text-zinc-900" href="#platform">
              Platform
            </a>
            <a className="hover:text-zinc-900" href="#features">
              Features
            </a>
            <a className="hover:text-zinc-900" href="#integrations">
              Integrations
            </a>
            <a className="hover:text-zinc-900" href="#pricing">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <a className="rounded-full border border-zinc-200 px-4 py-2 text-zinc-700" href="/login">
              Log in
            </a>
            <a className="rounded-full bg-zinc-900 px-4 py-2 font-semibold text-white" href="/login">
              Get started
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Smart Inventory</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              Run inventory, orders, and warehouses from a single command center.
            </h1>
            <p className="mt-4 text-lg text-zinc-600">
              Designed for fast-growing product businesses that need real-time visibility, automated reorder signals, and
              clean workflows across locations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white" href="/login">
                Start free demo
              </a>
              <a className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700" href="/app">
                View live dashboard
              </a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-zinc-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">99.9% uptime</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">SOC2-ready</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Multi-location</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Live signal</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Low stock</p>
                  <p className="mt-3 text-2xl font-semibold">18 SKUs</p>
                  <p className="mt-1 text-xs text-zinc-500">Auto-reorder suggested</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Orders today</p>
                  <p className="mt-3 text-2xl font-semibold">142</p>
                  <p className="mt-1 text-xs text-zinc-500">Across 3 channels</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Fulfillment</p>
                  <p className="mt-3 text-2xl font-semibold">96%</p>
                  <p className="mt-1 text-xs text-zinc-500">On-time SLA</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Inventory value</p>
                  <p className="mt-3 text-2xl font-semibold">?8.2M</p>
                  <p className="mt-1 text-xs text-zinc-500">Across 4 warehouses</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-t border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Unified data</p>
                <h3 className="mt-3 text-xl font-semibold">Single source of truth</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Inventory, orders, suppliers, and warehouse operations in one clean workspace.
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Automation</p>
                <h3 className="mt-3 text-xl font-semibold">Reorder at the right time</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Set thresholds by location and auto-generate purchase orders in minutes.
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Visibility</p>
                <h3 className="mt-3 text-xl font-semibold">Real-time operational insights</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Spot low stock, SLA risks, and demand signals before they impact revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Core features</p>
              <h2 className="mt-2 text-3xl font-semibold">Everything ops teams need to scale.</h2>
            </div>
            <a className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700" href="/login">
              Request a demo
            </a>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Inventory control</h3>
              <p className="mt-2 text-sm text-zinc-600">Multi-location stock, barcode-ready, cycle count support.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Order orchestration</h3>
              <p className="mt-2 text-sm text-zinc-600">Centralize orders from Shopify, Amazon, and wholesale.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Supplier management</h3>
              <p className="mt-2 text-sm text-zinc-600">Track lead times, PO status, and vendor reliability.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Warehouse ops</h3>
              <p className="mt-2 text-sm text-zinc-600">Pick/pack workflows with location performance metrics.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Analytics</h3>
              <p className="mt-2 text-sm text-zinc-600">Inventory turns, demand signals, margin visibility.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h3 className="text-lg font-semibold">Automations</h3>
              <p className="mt-2 text-sm text-zinc-600">Workflow rules and alerts for ops teams.</p>
            </div>
          </div>
        </section>

        <section id="integrations" className="border-t border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Integrations</p>
                <h2 className="mt-2 text-3xl font-semibold">Connect your entire commerce stack.</h2>
              </div>
              <a className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700" href="/login">
                Talk to sales
              </a>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                "Shopify",
                "Amazon",
                "WooCommerce",
                "QuickBooks",
                "Xero",
                "Shippo",
                "FedEx",
                "DHL",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { name: "Starter", price: "$299", desc: "Up to 1,000 orders / month" },
              { name: "Growth", price: "$699", desc: "Up to 10,000 orders / month" },
              { name: "Scale", price: "Custom", desc: "Enterprise volumes & SLAs" },
            ].map((tier) => (
              <div key={tier.name} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-2 text-3xl font-semibold">{tier.price}</p>
                <p className="mt-1 text-sm text-zinc-500">{tier.desc}</p>
                <a className="mt-6 inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white" href="/login">
                  Choose plan
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-900 text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Ready to build your supply chain control room?</h2>
              <p className="mt-2 text-sm text-zinc-300">
                Launch a demo workspace in minutes and explore the live dashboard.
              </p>
            </div>
            <a className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-900" href="/login">
              Start the demo
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
