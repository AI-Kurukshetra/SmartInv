"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }
    router.push("/app");
  };

  const handleGithub = async () => {
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">OrderCare</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Sign in to Operations Command</h1>
          <p className="mt-3 text-base text-zinc-600">
            Access live inventory, orders, and analytics in one secure workspace.
          </p>
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-sm font-semibold">Why teams love this</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-zinc-600">
              <li>Real-time multi-location inventory</li>
              <li>Auto-reorder suggestions</li>
              <li>Clean enterprise reporting</li>
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <a className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500" href="/">
              ← Back to home
            </a>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Login</p>
            <h2 className="mt-3 text-2xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-sm text-zinc-500">Use your OrderCare workspace credentials.</p>

            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Email</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                  placeholder="you@company.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Password</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button
                className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                type="submit"
                disabled={busy}
              >
                Sign in
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
              <div className="h-px flex-1 bg-zinc-200" />
              or continue with
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <button
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              onClick={handleGithub}
              disabled={busy}
              type="button"
            >
              Continue with GitHub
            </button>

            {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}

            <p className="mt-6 text-xs text-zinc-500">
              New here? <span className="font-semibold text-zinc-800">Contact sales</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
