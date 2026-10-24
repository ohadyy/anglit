import type { Metadata } from "next";
import Link from "next/link";
import ReceiptPrinter from "@/components/ReceiptPrinter";
import { LabClient } from "./LabClient";

export const metadata: Metadata = {
  title: "מעבדה",
  robots: { index: false },
};

// Internal page for trying the new UI pieces in one place on a phone. Not linked from the site.
export default function LabPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pb-32 pt-4">
      <h1 className="font-display text-3xl font-bold tracking-tight">מעבדה</h1>
      <p className="mt-2 opacity-70">כל הרכיבים החדשים במקום אחד, לבדיקה בטלפון.</p>

      <LabClient />

      <section className="mt-12">
        <h2 className="text-xl font-bold">אישור הזמנה</h2>
        <p className="mb-5 mt-1 text-sm opacity-70">
          מדפיס לבד כשהוא נכנס למסך. משכו את הנייר למטה כדי לקרוע אותו, או זרקו אותו בתנועה מהירה. בדף האמיתי הוא מופיע אחרי תשלום.
        </p>
        <div className="flex justify-center">
          <ReceiptPrinter
            order="A1B2C3"
            date={new Date().toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })}
            items={[{ name: "7 ימים לאמירנט", quantity: 1, price: 347 }]}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">ועוד</h2>
        <ul className="mt-3 grid gap-1">
          <li>
            <Link href="/amirnet" className="flex min-h-11 items-center underline underline-offset-4">
              /amirnet: מדד הגלילה בראש העמוד
            </Link>
          </li>
          <li>
            <Link href="/checkout?product=course" className="flex min-h-11 items-center underline underline-offset-4">
              /checkout: סרגל הסיכום בתחתית (בטלפון)
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
