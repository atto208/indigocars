"use client";

import { useActionState } from "react";
import { createUser, updateUser } from "../actions";

const field =
  "w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition focus:border-brand-light";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-soft";

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, undefined);
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-white/5 bg-ink-soft p-6">
      <h2 className="font-display text-sm font-bold uppercase tracking-widest text-brand-light">Add a user</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Username</label>
          <input name="username" required autoComplete="off" className={field} placeholder="e.g. wassim" />
        </div>
        <div>
          <label className={labelCls}>Display name (optional)</label>
          <input name="name" className={field} placeholder="e.g. Wassim K." />
        </div>
        <div>
          <label className={labelCls}>Role</label>
          <select name="role" defaultValue="manager" className={field}>
            <option value="manager">Manager — can do everything except manage users</option>
            <option value="admin">Admin — full access incl. user management</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input name="password" type="text" required minLength={6} autoComplete="new-password" className={field} placeholder="at least 6 characters" />
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button disabled={pending} className="rounded-xl bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-white transition hover:bg-accent-light disabled:opacity-50">
        {pending ? "Adding…" : "Add user"}
      </button>
    </form>
  );
}

export function EditUserForm({
  id,
  name,
  role,
  isSelf,
}: {
  id: string;
  name: string;
  role: string;
  isSelf: boolean;
}) {
  const [state, action, pending] = useActionState(updateUser, undefined);
  return (
    <form action={action} className="mt-4 space-y-4 border-t border-white/5 pt-4">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Display name</label>
          <input name="name" defaultValue={name} className={field} />
        </div>
        <div>
          <label className={labelCls}>Role</label>
          <select name="role" defaultValue={role} className={field} disabled={isSelf} title={isSelf ? "You can't change your own role" : undefined}>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          {isSelf && <input type="hidden" name="role" value={role} />}
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>New password (leave blank to keep current)</label>
          <input name="password" type="text" autoComplete="new-password" className={field} placeholder="••••••" />
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button disabled={pending} className="rounded-xl bg-brand px-5 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white transition hover:bg-brand-light disabled:opacity-50">
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
