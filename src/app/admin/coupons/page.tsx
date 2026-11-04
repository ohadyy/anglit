import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { isStaff } from "@/lib/access";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CouponManager } from "./CouponManager";

export const metadata: Metadata = {
  title: "קופונים",
  robots: { index: false, follow: false },
};

// Same gate as /admin: staff phones only, anyone else gets a plain 404.
export default async function CouponsPage() {
  const authed = await auth.api.getSession({ headers: await headers() });
  if (!authed) redirect("/sign-in?next=/admin/coupons");
  if (!(await isStaff(authed.user.id))) notFound();

  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));

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
      <h1 className="font-display text-3xl font-bold sm:text-4xl">קופונים</h1>
      <p className="mt-2 leading-relaxed opacity-70">
        קופון חדש עובד באתר מיד, בלי העלאה. הלקוח מקליד אותו בעמוד התשלום של הסמינר. מחיקה מבטלת אותו באותו רגע.
      </p>

      <CouponManager rows={rows.map((c) => ({ code: c.code, percent: c.percent, priceIls: c.priceIls }))} />
      <div className="pb-10" />
    </div>
  );
}
