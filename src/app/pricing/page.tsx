import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import Link from "next/link";
import { featureRows, pricingCopy, products, type Product } from "@/content/pricingCopy";
import { LeadForm } from "@/components/LeadForm";
import { upcomingCourseOffer, type CourseOffer } from "@/lib/cohorts";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { hasCourse } from "@/lib/access";

// Shows the live cohort offer and seat count, so this page cannot be cached at build time
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מחיר",
  description: "המחיר לסמינר הכנה לאמירנט של Anglit.",
};

const desktopOrder: Record<Product["id"], string> = {
  access: "lg:order-3",
  course: "lg:order-2",
  private: "lg:order-1",
};

export default async function PricingPage() {
  const offer = await upcomingCourseOffer();
  const session = await auth.api.getSession({ headers: await headers() });
  const boughtCourse = session ? await hasCourse(session.user.id) : false;
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
      <BreadcrumbJsonLd trail={[{ name: "מחיר", path: "/pricing" }]} />
        <section className="mx-auto max-w-3xl px-4 pb-10 pt-6 text-center sm:px-6">
          <p className="text-sm font-semibold tracking-[0.08em] opacity-70">{pricingCopy.eyebrow}</p>
          <h1 className="font-display mt-3 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-balance sm:text-5xl">
            {pricingCopy.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed opacity-80">
            {pricingCopy.sub.split("פעם אחת").map((part, i, all) => (
              <span key={i}>
                {part}
                {i < all.length - 1 && <mark className="pink">פעם אחת</mark>}
              </span>
            ))}
          </p>
        </section>

        <section className="px-4 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:items-stretch">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                className={desktopOrder[product.id]}
                delay={i * 140}
                offer={product.id === "course" ? offer : null}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href={!session ? "/sign-up" : boughtCourse ? "/account#cohort" : "/checkout?product=course"}
              className="rounded-full border border-fg/25 px-6 py-3 font-semibold hover:bg-fg/5"
            >
              {pricingCopy.cta}
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-center text-2xl font-bold">{pricingCopy.faqTitle}</h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {pricingCopy.faq.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 font-semibold">
                    {item.q}
                    <span className="shrink-0 text-xl opacity-70 group-open:hidden">+</span>
                    <span className="hidden shrink-0 text-xl opacity-70 group-open:inline">−</span>
                  </summary>
                  <p className="mt-3 leading-relaxed opacity-80">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-md">
            <LeadForm source="pricing" />
          </div>
        </section>
      </main>

    </div>
  );
}

function ProductCard({
  product,
  className,
  delay,
  offer,
}: {
  product: Product;
  className: string;
  delay: number;
  offer: CourseOffer | null;
}) {
  const recommended = !!product.badge;

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`enter lift relative flex flex-col rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_60px_-24px_rgb(14_8_82/0.15)] ${
        recommended ? "border-2 border-fg" : "border border-line"
      } ${className}`}
    >
      {product.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-4 py-1 text-sm font-semibold text-bg">
          {product.badge}
        </span>
      )}

      <div className="flex flex-col lg:min-h-[17rem]">
      <p className="text-sm opacity-70">{product.name}</p>
      {offer ? (
        <>
          <p className="mt-3 text-6xl font-bold tracking-tight text-ok">{offer.priceIls}</p>
          <p className="mt-1 text-sm opacity-70">₪ למחזור {offer.label} בלבד</p>
          <p className="mt-4 rounded-full bg-ok/15 px-4 py-2 text-sm font-semibold text-ok">
            הנחה של {Math.round((1 - offer.priceIls / Number(product.price)) * 100)}%
          </p>
          <p className="mt-3 rounded-full border border-warn/40 bg-warn/10 px-4 py-2 text-sm font-semibold text-warn">
            חוזר למחיר מלא למחזור הבא
          </p>
          <p className="mt-3 text-sm opacity-70">מחיר רגיל: {product.price} ₪</p>
        </>
      ) : (
        <>
          {product.listPrice && (
            <p className="mt-3 text-2xl">
              <span className="text-warn line-through">{product.listPrice} ₪</span>{" "}
              <span className="opacity-70">30% הנחה</span>
            </p>
          )}
          <p className={`${product.listPrice ? "mt-1 text-ok" : "mt-3"} text-6xl font-bold tracking-tight`}>{product.price}</p>
          <p className="mt-1 text-sm opacity-70">₪ {product.priceUnit}</p>
        </>
      )}
      {product.scarcity && (
        <p className="mt-4 rounded-full border border-warn/40 bg-warn/10 px-4 py-2 text-sm font-semibold text-warn">
          {product.scarcity}
        </p>
      )}
      </div>

      {/* Every card shows the same rows in the same order, so matching items line up across cards */}
      <ul className="mt-8 flex flex-1 flex-col text-start">
        {featureRows.map((row, i) => {
          const cell = row[product.id];
          const included = typeof cell === "string";
          const text = included ? cell : cell.missing;
          return (
            <li key={i} className="flex h-16 items-center gap-2.5 border-t border-line/60 py-2.5 first:border-t-0">
              {included ? (
                <svg viewBox="0 0 20 20" fill="none" className="size-5 shrink-0 text-ok" aria-hidden>
                  <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none" className="size-5 shrink-0 opacity-40" aria-hidden>
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              <span className={included ? "leading-snug opacity-90" : "leading-snug opacity-40 line-through"}>{text}</span>
            </li>
          );
        })}
      </ul>

      {product.note && (
        <p className="mt-6 rounded-2xl bg-fg/5 p-4 text-start text-sm leading-relaxed">{product.note}</p>
      )}

      <Link
        href={`/checkout?product=${product.id}`}
        className={`mt-8 flex w-full items-center justify-center rounded-full px-6 py-4 font-semibold ${
          recommended ? "bg-fg text-bg" : "border border-fg/25 hover:bg-fg/5"
        }`}
      >
        {pricingCopy.payCta}
      </Link>
    </div>
  );
}
