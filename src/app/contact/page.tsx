import type { Metadata } from "next";
import { businessDetails } from "@/content/legal";

export const metadata: Metadata = { title: "פרטי העסק" };

// Plain business details page. Linked only from the footer; it also gives Meta's business
// verification a clear place to find the legal name.
export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-4 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">פרטי העסק</h1>
      <dl className="mt-8 flex flex-col gap-4 leading-relaxed">
        <div>
          <dt className="text-sm opacity-70">שם העסק</dt>
          <dd>{businessDetails.name}</dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">שם משפטי</dt>
          <dd>{businessDetails.legalName}</dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">{businessDetails.registrationLabel} (עוסק פטור)</dt>
          <dd>{businessDetails.registrationNumber}</dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">כתובת</dt>
          <dd>{businessDetails.address}</dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">טלפון</dt>
          <dd>
            <bdi dir="ltr">{businessDetails.phone}</bdi>
          </dd>
        </div>
        <div>
          <dt className="text-sm opacity-70">אימייל</dt>
          <dd>
            <bdi dir="ltr">{businessDetails.email}</bdi>
          </dd>
        </div>
      </dl>
    </main>
  );
}
