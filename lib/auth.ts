import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE_NAME = "indigo_admin";

export type SessionUser = {
  id: string;
  username: string;
  name: string | null;
  role: string; // "admin" | "manager"
};

function secret() {
  return process.env.SESSION_SECRET || "dev-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

// Signed cookie carrying the user id. Role/identity are re-read from the DB on
// every request, so deleting a user or changing a role takes effect immediately.
export function makeSessionToken(userId: string): string {
  const payload = `${userId}:${Date.now()}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

function readUserId(token: string | undefined): string | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  try {
    const payload = Buffer.from(b64, "base64url").toString();
    const expected = sign(payload);
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
    return payload.split(":")[0] || null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const userId = readUserId(store.get(COOKIE_NAME)?.value);
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true, role: true },
  });
  return user;
}

// Any authenticated user (admin or manager).
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

// Admin role only (user management).
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Forbidden — admins only");
  return user;
}

export const ADMIN_COOKIE = COOKIE_NAME;
