import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { crmNotes, crmState, leads, orders, user } from "@/db/schema";
import { isStaff, isStaffPhone } from "@/lib/access";
import { normalizePhone } from "@/lib/phoneAuth";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CrmBoard } from "./CrmBoard";
import type { Contact, CrmKind, Note } from "./labels";

export const metadata: Metadata = {
  title: "לידים ושיחות",
  robots: { index: false, follow: false },
};

// Same gate as /admin: staff phones only, anyone else gets a plain 404.
export default async function CrmPage() {
  const authed = await auth.api.getSession({ headers: await headers() });
  if (!authed) redirect("/sign-in?next=/admin/crm");
  if (!(await isStaff(authed.user.id))) notFound();

  const [leadRows, userRows, paidRows, stateRows, noteRows] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)),
    db.select({ id: user.id, name: user.name, phone: user.phone, createdAt: user.createdAt }).from(user),
    db.select({ userId: orders.userId, product: orders.product, provider: orders.provider }).from(orders).where(eq(orders.status, "paid")),
    db.select().from(crmState),
    db.select().from(crmNotes).orderBy(desc(crmNotes.createdAt)),
  ]);

  // Card payments count as "paid"; a zero-agorot manual order is free access given by hand.
  const paidProducts = new Map<string, string[]>();
  const manualIds = new Set<string>();
  for (const o of paidRows) {
    if (o.provider === "manual") manualIds.add(o.userId);
    else if (o.product) paidProducts.set(o.userId, [...(paidProducts.get(o.userId) ?? []), o.product]);
  }

  const stateMap = new Map(stateRows.map((s) => [`${s.kind}:${s.refId}`, s]));
  const notesMap = new Map<string, Note[]>();
  for (const n of noteRows) {
    const key = `${n.kind}:${n.refId}`;
    notesMap.set(key, [...(notesMap.get(key) ?? []), { id: n.id, type: n.type, body: n.body, createdAt: n.createdAt }]);
  }

  const userByPhone = new Map(userRows.filter((u) => u.phone).map((u) => [u.phone as string, u.id]));

  const toContact = (
    kind: CrmKind,
    refId: string,
    accountId: string | undefined,
    base: Pick<Contact, "name" | "phone" | "email" | "source" | "message" | "createdAt">,
  ): Contact => {
    const key = `${kind}:${refId}`;
    const state = stateMap.get(key);
    const products = (accountId && paidProducts.get(accountId)) || [];
    return {
      key,
      kind,
      refId,
      ...base,
      status: state?.status ?? "new",
      followUp: state?.followUpAt ? state.followUpAt.toISOString().slice(0, 10) : null,
      paid: products.length > 0,
      products,
      manual: !!accountId && manualIds.has(accountId),
      registered: !!accountId,
      notes: notesMap.get(key) ?? [],
    };
  };

  const contacts: Contact[] = [];
  const leadPhones = new Set<string>();
  for (const l of leadRows) {
    const isEmail = l.contact.includes("@");
    const phone = isEmail ? null : normalizePhone(l.contact);
    if (phone && isStaffPhone(phone)) continue;
    if (phone) leadPhones.add(phone);
    contacts.push(
      toContact("lead", l.id, phone ? userByPhone.get(phone) : undefined, {
        name: l.name,
        phone,
        email: isEmail ? l.contact : null,
        source: l.source,
        message: l.message,
        createdAt: l.createdAt,
      }),
    );
  }
  // A person who left details and then signed up stays one card, the lead's, which holds the history.
  for (const u of userRows) {
    if (isStaffPhone(u.phone) || (u.phone && leadPhones.has(u.phone))) continue;
    contacts.push(toContact("user", u.id, u.id, { name: u.name, phone: u.phone, email: null, source: "account", message: null, createdAt: u.createdAt }));
  }

  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jerusalem" }).format(new Date());

  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-3xl flex-col px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" aria-label="לעמוד הבית">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <ThemeToggle />
      </header>

      <Link href="/admin" className="mt-8 inline-flex min-h-11 w-fit items-center text-sm font-semibold underline underline-offset-4">
        ← פאנל הניהול
      </Link>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">לידים ושיחות</h1>
      <p className="mt-2 leading-relaxed opacity-70">
        כל מי שהשאיר פרטים או נרשם לאתר, במקום אחד. אפשר לסמן מי כבר שוחחת איתו, לרשום הערות, לקבוע תזכורת, ולראות מי שילם.
      </p>

      <CrmBoard contacts={contacts} today={today} />
      <div className="pb-10" />
    </div>
  );
}
