"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="mt-6 space-y-4">
      <input
        type="password"
        name="password"
        required
        autoFocus
        placeholder="Password"
        className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-white outline-none transition focus:border-brand-light"
      />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-lg bg-accent py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition hover:bg-accent-light disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
