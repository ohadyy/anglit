import Link from "next/link";
import type { Tier, Viewer } from "@/lib/viewer";

const LABELS: Record<Tier, string> = { guest: "אורח", free: "נרשם בלי תשלום", access: "גישה לאתר", course: "סמינר" };

// Staff only: see a page the way each kind of visitor sees it (?as=...). Nobody else sees this bar.
export function TierPreview({ viewer, path }: { viewer: Viewer; path: string }) {
  if (!viewer.staff) return null;
  return (
    <nav aria-label="תצוגה לפי סוג משתמש (מנהל בלבד)" className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-2 rounded-2xl border border-dashed border-line px-3 py-2 text-xs">
      <span className="opacity-70">מנהל · תצוגה בתור:</span>
      {(Object.keys(LABELS) as Tier[]).map((t) => (
        <Link
          key={t}
          href={`${path}?as=${t}`}
          className={`inline-flex min-h-9 items-center rounded-full px-3 ${viewer.tier === t ? "bg-fg font-semibold text-bg" : "border border-line"}`}
        >
          {LABELS[t]}
        </Link>
      ))}
    </nav>
  );
}
