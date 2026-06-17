import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { deleteUser } from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";
import { CreateUserForm, EditUserForm } from "./UserForms";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") redirect("/admin");

  const users = await prisma.user.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] });
  const adminCount = users.filter((u) => u.role === "admin").length;

  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">Users</h1>
      <p className="mt-2 text-sm text-brand-soft">
        Only admins can manage users. <b className="text-white">Managers</b> can do everything else on the site; only{" "}
        <b className="text-white">admins</b> can add or edit users.
      </p>

      <div className="mt-6">
        <CreateUserForm />
      </div>

      <div className="mt-8 space-y-3">
        {users.map((u) => {
          const isSelf = u.id === me.id;
          const isLastAdmin = u.role === "admin" && adminCount <= 1;
          return (
            <details key={u.id} className="rounded-2xl border border-white/5 bg-ink-soft p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white">
                    {(u.name || u.username).charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-white">{u.name || u.username}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${u.role === "admin" ? "bg-accent/25 text-accent-light" : "bg-brand/30 text-brand-soft"}`}>
                        {u.role}
                      </span>
                      {isSelf && <span className="text-[10px] uppercase tracking-wider text-brand-soft/50">you</span>}
                    </div>
                    <div className="text-xs text-brand-soft/60">@{u.username} · added {fmt(u.createdAt)}</div>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-brand-soft/50">edit ▾</span>
              </summary>

              <EditUserForm id={u.id} name={u.name ?? ""} role={u.role} isSelf={isSelf} />

              {!isSelf && !isLastAdmin && (
                <form action={deleteUser} className="mt-2">
                  <input type="hidden" name="id" value={u.id} />
                  <ConfirmSubmit
                    message={`Delete the user “${u.name || u.username}” (@${u.username})?\n\nThey will no longer be able to log in. This cannot be undone.`}
                    className="w-full rounded-lg border border-red-400/30 py-2 font-display text-xs font-bold uppercase tracking-wider text-red-300 transition hover:bg-red-500/20"
                  >
                    Delete user
                  </ConfirmSubmit>
                </form>
              )}
              {isLastAdmin && (
                <p className="mt-2 text-center text-xs text-brand-soft/50">The last admin can't be deleted.</p>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
