import Image from "next/image";
import Link from "next/link";
import { copy } from "@/content/copy";
import { businessDetails, legalDocs } from "@/content/legal";
import { site } from "@/lib/site";
import { InstagramIcon } from "@/components/InstagramIcon";

const study = [
  { href: "/practice", label: "תרגול חינמי" },
  { href: "/pricing", label: "מסלולים ומחירים" },
  { href: "/exam-dates", label: "מועדי הבחינה" },
  { href: "/account", label: "האזור האישי" },
];

// Dark block (data-invert): mist text on ink. Section markers use Hebrew letters.
export function SiteFooter() {
  return (
    // Bottom padding on phones keeps the last lines clear of the tab bar
    <footer data-invert className="mt-auto pb-24 sm:pb-0">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pb-10 sm:pt-20">
        <p className="text-3xl font-bold leading-tight sm:text-6xl">
          <span className="relative inline-block">
            בואו נתחיל
            <span aria-hidden className="absolute inset-x-0 bottom-1 -z-10 h-[0.35em] bg-marker" />
          </span>
        </p>
        <p className="font-hand mt-2 text-xl opacity-80 sm:mt-3 sm:text-3xl">את שבוע ההכנה שלכם לאמירנט.</p>

        <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:mt-14 sm:grid-cols-3 sm:gap-10 sm:pt-10">
          <section>
            <p className="font-hand text-2xl">(א) צרו קשר</p>
            <ul className="mt-4 flex flex-col gap-2 text-base">
              <li>
                <a
                  href={businessDetails.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline underline-offset-4"
                >
                  וואטסאפ <bdi dir="ltr">{businessDetails.phone}</bdi>
                </a>
              </li>
              <li>
                <bdi dir="ltr">{businessDetails.email}</bdi>
              </li>
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4"
                >
                  <InstagramIcon className="size-5" />
                  <bdi dir="ltr">{businessDetails.instagram}</bdi>
                </a>
              </li>
            </ul>
          </section>

          <section>
            <p className="font-hand text-2xl">(ב) ללמוד</p>
            <ul className="mt-4 flex flex-col gap-2 text-base">
              {study.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:opacity-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="font-hand text-2xl">(ג) משפטי</p>
            <ul className="mt-4 flex flex-col gap-2 text-base">
              <li className="opacity-80">
                {businessDetails.legalName} · {businessDetails.registrationLabel} {businessDetails.registrationNumber}
              </li>
              <li className="opacity-80">כתובת העסק: {businessDetails.address}</li>
              {legalDocs.map((doc) => (
                <li key={doc.slug}>
                  <Link href={`/legal/${doc.slug}`} className="inline-flex min-h-11 items-center underline underline-offset-4 opacity-80 hover:opacity-100">
                    {doc.title}
                  </Link>
                </li>
              ))}
              {/* Cancelling a purchase has its own visible link, as the consumer law requires */}
              <li>
                <Link href="/legal/refunds" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:opacity-100">
                  ביטול עסקה
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-5 text-sm sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-6">
          <Image src="/brand/wordmark-light.png" alt="Anglit" width={1576} height={481} className="h-6 w-auto self-start sm:h-7" />
          <p className="opacity-70">
            © {new Date().getFullYear()} {businessDetails.name}. {copy.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
