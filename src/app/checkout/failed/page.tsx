import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "התשלום נכשל",
};

export default function CheckoutFailedPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 py-16 text-center">
      <Wordmark className="h-8 w-auto" />
      <h1 className="font-display mt-8 text-2xl font-bold">התשלום לא הושלם</h1>
      <p className="mt-3 leading-relaxed opacity-80">
        לא הצלחנו לחייב את הכרטיס. אפשר לנסות שוב, או לפנות אלינו אם זה ממשיך לקרות.
      </p>
      <Link href="/checkout" className="mt-8 rounded-full bg-fg px-6 py-3 font-semibold text-bg">
        לנסות שוב
      </Link>
    </div>
  );
}
