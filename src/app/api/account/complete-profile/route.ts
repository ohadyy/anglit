import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { account, rateLimit, user } from "@/db/schema";
import { isValidIlPhone, normalizePhone } from "@/lib/phoneAuth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

// Same cap as phone sign-in: the birth date is the password there, so linking by phone +
// birth date must not give a faster way to guess it. Fixed window, kept in the rate_limit table.
async function tooManyAttempts(phone: string): Promise<boolean> {
  const key = `link:${phone}`;
  const now = Date.now();
  const [row] = await db.select().from(rateLimit).where(eq(rateLimit.key, key)).limit(1);
  if (!row) {
    await db.insert(rateLimit).values({ id: crypto.randomUUID(), key, count: 1, lastRequest: now }).onConflictDoNothing();
    return false;
  }
  if (now - row.lastRequest > WINDOW_MS) {
    await db.update(rateLimit).set({ count: 1, lastRequest: now }).where(eq(rateLimit.key, key));
    return false;
  }
  if (row.count >= MAX_ATTEMPTS) return true;
  await db.update(rateLimit).set({ count: row.count + 1 }).where(eq(rateLimit.key, key));
  return false;
}

// A Google sign-in creates the account without a phone or birth date. This is the one place
// they can be set (the update hook in auth.ts blocks both fields). If the phone already
// belongs to a phone sign-up, the right birth date proves it is theirs and the Google login
// is attached to that account instead, so their exams and practice come with them.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json()) as { phone?: unknown; birthDate?: unknown; terms?: unknown; marketing?: unknown };
  const phone = typeof body.phone === "string" ? normalizePhone(body.phone) : "";
  const birthDate = typeof body.birthDate === "string" ? body.birthDate : "";
  if (!isValidIlPhone(phone) || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || body.terms !== true) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const [existing] = await db.select().from(user).where(eq(user.phone, phone)).limit(1);

  if (!existing) {
    const updated = await db
      .update(user)
      .set({ phone, birthDate, termsAccepted: true, marketingConsent: body.marketing === true })
      .where(and(eq(user.id, session.user.id), isNull(user.phone)))
      .returning({ id: user.id })
      // Unique violation if the same number was registered a moment ago
      .catch(() => []);
    if (!updated.length) return NextResponse.json({ error: "taken" }, { status: 409 });
    return NextResponse.json({ ok: true });
  }

  if (await tooManyAttempts(phone)) return NextResponse.json({ error: "rate limited" }, { status: 429 });
  if (existing.birthDate !== birthDate) return NextResponse.json({ error: "mismatch" }, { status: 403 });

  const [alreadyGoogle] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, existing.id), eq(account.providerId, "google")))
    .limit(1);
  if (alreadyGoogle) return NextResponse.json({ error: "taken" }, { status: 409 });

  // Move the Google login to the existing account, then drop the empty one it just created.
  // Moving first matters: deleting the user would cascade to its account row.
  await db
    .update(account)
    .set({ userId: existing.id })
    .where(and(eq(account.userId, session.user.id), eq(account.providerId, "google")));
  await db.delete(user).where(and(eq(user.id, session.user.id), isNull(user.phone)));
  return NextResponse.json({ linked: true });
}
