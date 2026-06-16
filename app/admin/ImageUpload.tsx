"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export default function ImageUpload({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue: string;
  label?: string;
}) {
  const [path, setPath] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setPath(json.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-soft">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink">
          {path && <img src={path} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1">
          <input type="hidden" name={name} value={path} />
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="block w-full text-sm text-brand-soft file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:font-display file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-white hover:file:bg-brand-light"
          />
          {busy && <p className="mt-1 text-xs text-brand-soft">Uploading…</p>}
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          <p className="mt-1 truncate text-xs text-brand-soft/50">{path}</p>
        </div>
      </div>
    </div>
  );
}
