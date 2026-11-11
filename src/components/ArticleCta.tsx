import Link from "next/link";

export function ArticleCta({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div data-invert="" className={`rounded-3xl p-6 sm:p-8 ${className}`}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 opacity-80">שבוע אחד בקבוצה קטנה עם מורה אמיתי, ותרגול יומי עם הסבר לכל שאלה.</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link href="/pricing" className="inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
          לכל המסלולים והמחירים
        </Link>
        <Link href="/start" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80">
          לתרגול חינם
        </Link>
      </div>
    </div>
  );
}
