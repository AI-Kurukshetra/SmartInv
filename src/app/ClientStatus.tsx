"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Status = "missing_env" | "checking" | "ready" | "error";

export default function ClientStatus() {
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState<string>("");

  const hasEnv = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  useEffect(() => {
    if (!hasEnv) {
      setStatus("missing_env");
      setMessage("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    let active = true;
    supabase.auth
      .getSession()
      .then(({ error }) => {
        if (!active) return;
        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }
        setStatus("ready");
        setMessage("Connected. Auth client is reachable.");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Unknown error");
      });

    return () => {
      active = false;
    };
  }, [hasEnv]);

  const badge = status === "ready" ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900";
  const label =
    status === "missing_env"
      ? "Missing env"
      : status === "checking"
        ? "Checking"
        : status === "ready"
          ? "Ready"
          : "Error";

  return (
    <div className="mt-6 w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Supabase Status</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>{label}</span>
      </div>
      <p className="mt-3 text-sm text-zinc-600">{message || "Loading..."}</p>
    </div>
  );
}
