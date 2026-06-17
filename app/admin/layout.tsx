import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "./actions";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin — Indigo Cars" };

const nav = [
  { href: "/admin", label: "Dashboard", icon: "◧" },
  { href: "/admin/content", label: "Website Content", icon: "✎" },
  { href: "/admin/cars", label: "Cars", icon: "⊞" },
  { href: "/admin/reviews", label: "Reviews", icon: "★" },
  { href: "/admin/calendar", label: "Booking Calendar", icon: "▦" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div dir="ltr" className="flex min-h-screen items-center justify-center bg-ink px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-soft p-8">
          <Image
            src="/brand/logo-white.png"
            alt="Indigo Cars"
            width={170}
            height={38}
            className="mx-auto h-9 w-auto"
          />
          <h1 className="mt-6 text-center font-display text-lg font-semibold uppercase tracking-widest text-white">
            Admin Panel
          </h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="flex min-h-screen bg-ink">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-white/5 bg-ink-soft">
        <Link href="/" className="flex h-16 items-center border-b border-white/5 px-5">
          <Image src="/brand/logo-white.png" alt="Indigo Cars" width={130} height={30} className="h-7 w-auto" />
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm text-brand-soft transition hover:bg-brand/30 hover:text-white"
            >
              <span className="text-brand-light">{n.icon}</span>
              {n.label}
            </Link>
          ))}
          {user.role === "admin" && (
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm text-brand-soft transition hover:bg-brand/30 hover:text-white"
            >
              <span className="text-brand-light">⚇</span>
              Users
            </Link>
          )}
        </nav>
        <div className="space-y-1 border-t border-white/5 p-3">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-display text-xs font-bold text-white">
              {(user.name || user.username).charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold text-white">{user.name || user.username}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-light">{user.role}</div>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-2 text-sm text-brand-soft transition hover:text-white"
          >
            View website ↗
          </Link>
          <form action={logout}>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-brand-soft transition hover:text-red-300">
              Log out
            </button>
          </form>
        </div>
      </aside>
      <main className="ml-56 flex-1 p-8">{children}</main>
    </div>
  );
}
