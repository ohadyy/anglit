import Link from "next/link";
import { copy } from "@/content/copy";
import { LockIcon } from "@/components/LockIcon";

export function LockedExam() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white">
        <LockIcon />
      </div>
      <h1 className="font-display mt-5 text-2xl font-bold">{copy.examLockedTitle}</h1>
      <p className="mt-2 leading-relaxed opacity-70">{copy.examLockedText}</p>
      <Link
        href="/pricing"
        className="mt-6 flex w-full items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg"
      >
        {copy.examLockedCta}
      </Link>
      <Link href="/account" className="mt-4 text-sm underline opacity-70">
        חזרה לאזור האישי
      </Link>
    </div>
  );
}
