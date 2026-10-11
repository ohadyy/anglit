import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <Image
        src="/brand/mascot-404.png"
        alt=""
        width={220}
        height={220}
        className="mascot-bob h-auto w-[180px] sm:w-[220px]"
      />
      <p className="mt-6 text-sm font-semibold tracking-[0.08em] opacity-70">שגיאה 404</p>
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">הדף הזה <mark className="pink">לא נמצא</mark></h1>
      <p className="mt-3 leading-relaxed opacity-80">אולי הקישור השתנה, או שהוא פשוט לא קיים. בואו נחזור לעמוד הבית.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="rounded-full bg-fg px-7 py-3.5 text-center font-semibold text-bg">
          לעמוד הבית
        </Link>
        <Link href="/practice" className="rounded-full border border-fg/25 px-7 py-3.5 text-center font-semibold hover:bg-fg/5">
          לתרגול חינם
        </Link>
      </div>
    </main>
  );
}
