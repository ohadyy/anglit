import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { findPlatinumTest } from "@/content/examTests";
import { buildPlatinumExam, platinumPassage } from "@/lib/platinumExam";
import { LockIcon } from "@/components/LockIcon";
import { PlatinumExam } from "../PlatinumExam";

export default async function PlatinumRunPage({ params }: PageProps<"/platinum/[number]">) {
  const { number } = await params;
  const test = findPlatinumTest(number);
  if (!test) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;

  if (!test.free && !paid) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-5 text-center">
        <LockIcon className="size-8 text-[var(--gold)]" />
        <h1 className="plat-serif plat-gold-text mt-5 text-4xl font-semibold">Platinum</h1>
        <p className="mt-3 leading-relaxed opacity-75">מבחני Platinum נפתחים עם התשלום על הסמינר.</p>
        <Link href="/pricing" className="mt-8 rounded-full bg-[var(--fg)] px-8 py-3.5 font-semibold text-[var(--bg)]">
          לפרטים על הסמינר
        </Link>
        <Link href="/platinum" className="mt-4 text-sm underline underline-offset-4 opacity-60">
          חזרה
        </Link>
      </div>
    );
  }

  return (
    <PlatinumExam
      plan={buildPlatinumExam(number)}
      passage={platinumPassage(number)}
      test={test}
      userName={session?.user.name ?? ""}
      upsell={!paid}
    />
  );
}
