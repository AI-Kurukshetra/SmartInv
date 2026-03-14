"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type AuthState = {
  email: string | null;
  id: string | null;
};

export default function ClientAuth() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>({ email: null, id: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const user = data.session?.user ?? null;
      setAuth({ email: user?.email ?? null, id: user?.id ?? null });
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setAuth({ email: user?.email ?? null, id: user?.id ?? null });
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signInWithGithub = async () => {
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setError("");
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message);
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="mt-6 w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">GitHub Auth</h2>
          <p className="mt-1 text-sm text-zinc-600">
            {auth.email ? `Signed in as ${auth.email}` : "Not signed in"}
          </p>
        </div>
        {auth.id ? (
          <button
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            onClick={signOut}
            disabled={busy}
          >
            Sign out
          </button>
        ) : (
          <button
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            onClick={signInWithGithub}
            disabled={busy}
          >
            Continue with GitHub
          </button>
        )}
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
