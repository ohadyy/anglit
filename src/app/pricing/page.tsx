import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import Link from "next/link";
import { featureRows, getProduct, loyaltyLabel, pricingCopy, products, type Product } from "@/content/pricingCopy";
import { LeadForm } from "@/components/LeadForm";
import { FeatureToggle } from "@/components/FeatureToggle";
import { TierPreview } from "@/components/TierPreview";
import { getViewer, isLoyal } from "@/lib/viewer";
import { coursePrice, discountPercent } from "@/lib/pricing";

// The page depends on who is signed in, so it cannot be cached at build time
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מחיר קורס הכנה לאמירנט",
  description: "כמה עולה קורס הכנה לאמירנט ב-Anglit: הסמינר של שבוע בקבוצת זום קטנה, גישה לאתר התרגול, ומה כלול בכל מסלול.",
  alternates: { canonical: "/pricing" },
};

const desktopOrder: Record<Product["id"], string> = {
  // On phones: seminar, site access, private lessons. Cards are compact there (see FeatureToggle)
  access: "order-2 lg:order-3",
  course: "order-1 lg:order-2",
  private: "order-3 lg:order-1",
};

// The grid narrows when a member already owns some of the products
const gridFor: Record<number, string> = { 1: "max-w-md", 2: "max-w-3xl lg:grid-cols-2", 3: "max-w-5xl lg:grid-cols-3" };

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const { as } = await searchParams;
  const viewer = await getViewer(as);
  const { member } = pricingCopy;
  const paid = viewer.tier === "access" || viewer.tier === "course";
  const loyal = isLoyal(viewer);
  // Never offer what they already have. Every product includes site access, so a paying member never sees it.
  const shown = products.filter((p) => !viewer.owned.includes(p.id) && !(p.id === "access" && paid));
  const ownedNames = viewer.owned.map((id) => getProduct(id)?.name).filter(Boolean).join(" + ") || getProduct("access")?.name;

  const hero =
    viewer.tier === "course"
      ? { eyebrow: `${member.yourPlan}: ${ownedNames}`, title: shown.length ? member.courseTitle : member.allSetTitle, sub: shown.length ? member.courseSub : member.allSetSub }
      : viewer.tier === "access"
        ? { eyebrow: `${member.yourPlan}: ${ownedNames}`, title: member.accessTitle, sub: member.accessSub }
        : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
      <BreadcrumbJsonLd trail={[{ name: "מחיר", path: "/pricing" }]} />
        <TierPreview viewer={viewer} path="/pricing" />
        <section className="mx-auto max-w-3xl px-4 pb-10 pt-6 text-center sm:px-6">
          <p className="text-sm font-semibold tracking-[0.08em] opacity-70">{hero ? hero.eyebrow : pricingCopy.eyebrow}</p>
          <h1 className="font-display mt-3 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-balance sm:text-5xl">
            {hero ? hero.title : pricingCopy.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed opacity-80">
            {hero
              ? hero.sub
              : pricingCopy.sub.split("פעם אחת").map((part, i, all) => (
                  <span key={i}>
                    {part}
                    {i < all.length - 1 && <mark className="pink">פעם אחת</mark>}
                  </span>
                ))}
          </p>
          {viewer.tier === "course" && (
            <Link href="/account" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-fg px-8 py-3 font-semibold text-bg">
              {member.courseCta}
            </Link>
          )}
        </section>

        {shown.length > 0 && (
          <section className="px-4 sm:px-6">
            {viewer.tier === "course" && (
              <div className="mx-auto mb-6 max-w-md text-center">
                <h2 className="text-2xl font-bold">{member.privateTitle}</h2>
                <p className="mt-2 leading-relaxed opacity-80">{member.privateSub}</p>
              </div>
            )}
            <div className={`mx-auto grid gap-6 lg:items-stretch ${gridFor[shown.length]}`}>
              {shown.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={desktopOrder[product.id]}
                  delay={i * 140}
                  loyal={loyal && product.id === "course"}
                />
              ))}
            </div>
            {viewer.tier !== "course" && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={viewer.tier === "guest" ? "/sign-up" : "/checkout?product=course"}
                  className="rounded-full border border-fg/25 px-6 py-3 font-semibold hover:bg-fg/5"
                >
                  {viewer.tier === "access" ? member.accessCta : pricingCopy.cta}
                </Link>
              </div>
            )}
          </section>
        )}

        {/* The FAQ is about choosing a product; a seminar student has already chosen */}
        {viewer.tier !== "course" && (
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
        )}

        {/* We already have a paying member's details, so no "leave your details" form */}
        {!paid && (
          <section className="px-4 py-14 sm:px-6">
            <div className="mx-auto max-w-md">
              <LeadForm source="pricing" />
            </div>
          </section>
        )}
      </main>

    </div>
  );
}

function ProductCard({
  product,
  className,
  delay,
  loyal,
}: {
  product: Product;
  className: string;
  delay: number;
  loyal: boolean;
}) {
  const recommended = !!product.badge;
  // Only the course card is ever loyal
  const loyalPrice = loyal ? coursePrice(true) : null;

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`enter lift relative flex flex-col rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_60px_-24px_rgb(14_8_82/0.15)] max-lg:p-5 ${
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
      {loyalPrice ? (
        <>
          <p className="mt-3 text-2xl">
            <s className="text-warn">{loyalPrice.listIls} ₪</s>
          </p>
          <p className="mt-1 text-6xl font-bold tracking-tight text-ok">{loyalPrice.priceIls} ₪</p>
          <p className="mt-4 rounded-full bg-ok/15 px-4 py-2 text-sm font-semibold text-ok">{loyaltyLabel}</p>
        </>
      ) : (
        <>
          {product.listPriceIls && (
            <p className="mt-3 text-2xl">
              <span className="text-warn line-through">{product.listPriceIls} ₪</span>{" "}
              <span className="opacity-70">{discountPercent(product)}% הנחה</span>
            </p>
          )}
          {/* The course card drops the "one-time payment" line, so its shekel sign sits next to the number */}
          <p className={`${product.listPriceIls ? "mt-1 text-ok" : "mt-3"} text-6xl font-bold tracking-tight`}>
            {product.priceIls}
            {product.id === "course" && " ₪"}
          </p>
          {product.id !== "course" && <p className="mt-1 text-sm opacity-70">₪ {product.priceUnit}</p>}
        </>
      )}
      </div>

      {/* Every card shows the same rows in the same order, so matching items line up across cards */}
      <FeatureToggle label="מה כלול">
      <ul className="mt-4 flex flex-1 flex-col text-start lg:mt-8">
        {featureRows.map((row, i) => {
          const cell = row[product.id];
          const included = typeof cell === "string";
          const text = included ? cell : cell.missing;
          return (
            // Not-included rows only show on desktop, where they keep the cards' rows aligned
            <li key={i} className={`${included ? "flex" : "hidden lg:flex"} h-16 items-center gap-2.5 border-t border-line/60 py-2.5 first:border-t-0`}>
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
      </FeatureToggle>

      {product.note && (
        <p className="mt-6 hidden rounded-2xl lg:block bg-fg/5 p-4 text-start text-sm leading-relaxed">{product.note}</p>
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
