"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        router.replace(`/?auth_error=${encodeURIComponent(error.message)}`);
        return;
      }
      router.replace("/app");
      router.refresh();
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col px-6 py-16">
        <h1 className="text-2xl font-semibold text-zinc-900">Signing you in…</h1>
        <p className="mt-2 text-sm text-zinc-600">Finishing the GitHub OAuth flow.</p>
      </main>
    </div>
  );
}
