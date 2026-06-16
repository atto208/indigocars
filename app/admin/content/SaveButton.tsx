"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton({ label = "Save changes" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="sticky bottom-6 w-full rounded-xl bg-accent py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-accent/30 transition hover:bg-accent-light disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
