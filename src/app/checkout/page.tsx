import type { Metadata } from "next";
import { upcomingCourseOffer } from "@/lib/cohorts";
import { hasCourse } from "@/lib/access";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { checkoutCopy, getProduct } from "@/content/pricingCopy";
import { OfferToast } from "./OfferToast";

export const metadata: Metadata = {
  title: "תשלום",
  description: "השלמת הרכישה של Anglit.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productId } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const product = getProduct(productId);
  if (!product) redirect("/pricing");

  const next = `/checkout?product=${product.id}`;
  const offer = product.id === "course" ? await upcomingCourseOffer() : null;
  // Someone who already bought the course goes to their cohort instead of paying twice
  if (session && product.id === "course" && (await hasCourse(session.user.id))) redirect("/account#cohort");
  const joiningCohort = !!session && product.id === "course" && !!offer;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{checkoutCopy.title}</h1>
        {joiningCohort && (
          <p className="mt-3 text-lg leading-relaxed opacity-80">
            לא שילמתם על המחזור הקרוב. רוצים להצטרף?
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6 sm:p-8">
            <p className="text-sm font-semibold opacity-70">{checkoutCopy.summaryTitle}</p>
            <p className="mt-2 text-xl font-bold">{product.name}</p>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                {offer ? (
                  <>
                    <p className="mt-1 text-5xl font-bold tracking-tight">{offer.priceIls} ₪</p>
                    <p className="mt-1 text-sm opacity-70">למחזור {offer.label} בלבד · חוזר למחיר מלא למחזור הבא</p>
                    <p className="mt-1 text-sm opacity-70">מחיר הסמינר: {product.price} ₪</p>
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-5xl font-bold tracking-tight">{product.price} ₪</p>
                    <p className="mt-1 text-sm opacity-70">{product.priceUnit}</p>
                  </>
                )}
              </div>
            </div>

            <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-6 text-start">
              {product.included.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 size-5 shrink-0 text-ok">
                    <path
                      d="M4 10.5l3.5 3.5L16 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="leading-snug opacity-90">{f}</span>
                </li>
              ))}
              {product.excluded.map((f) => (
                <li key={f} className="flex items-start gap-2.5 opacity-70">
                  <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 size-5 shrink-0">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/pricing" className="mt-6 inline-flex min-h-11 items-center text-sm underline opacity-70">
              {checkoutCopy.changeProduct}
            </Link>
          </aside>

          <div className="flex flex-col gap-4">
            <section className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    session ? "bg-ok text-bg" : "bg-fg text-bg"
                  }`}
                >
                  {session ? "✓" : "1"}
                </span>
                <h2 className="text-lg font-bold">{checkoutCopy.accountTitle}</h2>
              </div>

              {session ? (
                <p className="mt-4 leading-relaxed opacity-80">
                  {checkoutCopy.accountSignedIn}{" "}
                  <span className="font-semibold">{session.user.name}</span>
                  <span className="opacity-70"> · </span>
                  <bdi dir="ltr" className="opacity-70">
                    {session.user.phone}
                  </bdi>
                </p>
              ) : (
                <>
                  <p className="mt-4 leading-relaxed opacity-80">{checkoutCopy.accountWhy}</p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Link
                      href={`/sign-up?next=${encodeURIComponent(next)}`}
                      className="flex w-full items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg"
                    >
                      {checkoutCopy.signUp}
                    </Link>
                    <Link
                      href={`/sign-in?next=${encodeURIComponent(next)}`}
                      className="flex min-h-11 items-center justify-center text-center text-sm underline opacity-70"
                    >
                      {checkoutCopy.signIn}
                    </Link>
                  </div>
                </>
              )}
            </section>

            {session && (
              <section className="rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fg text-sm font-bold text-bg">
                    2
                  </span>
                  <h2 className="text-lg font-bold">{checkoutCopy.payTitle}</h2>
                </div>

                <p className="mt-4 text-sm leading-relaxed opacity-70">{checkoutCopy.payNote}</p>

                <form action="/api/checkout/create" method="POST" className="mt-5">
                  <input type="hidden" name="product" value={product.id} />
                  <label className="mb-4 flex items-start gap-2.5 text-start text-sm leading-relaxed">
                    <input type="checkbox" name="terms" value="on" required className="mt-1 size-4 shrink-0" />
                    <span>
                      קראתי ואני מסכים/ה ל<Link href="/legal/terms" className="inline-flex min-h-11 items-center underline">תקנון</Link> ול
                      <Link href="/legal/refunds" className="underline">מדיניות הביטול והחזרים</Link>
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg"
                  >
                    {checkoutCopy.payCta}
                  </button>
                </form>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="font-semibold">{checkoutCopy.nextTitle}</p>
                  <p className="mt-2 leading-relaxed opacity-80">{checkoutCopy.nextSteps[product.id]}</p>
                </div>
              </section>
            )}

            <Link href="/pricing" className="flex min-h-11 items-center justify-center text-center text-sm underline opacity-70">
              {checkoutCopy.backToPricing}
            </Link>
          </div>
        </div>
      </main>

      {offer && <OfferToast priceIls={offer.priceIls} regularPrice={product.price} />}

    </div>
  );
}
