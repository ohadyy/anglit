import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const adminMetadata = (title: string): Metadata => ({ title, robots: { index: false, follow: false } });

// The frame every admin page shares: logo and theme toggle, a way back to /admin, the title and a line under it.
export function AdminShell({
  title,
  intro,
  width,
  back = true,
  children,
}: {
  title: string;
  intro: ReactNode;
  width: "max-w-3xl" | "max-w-6xl";
  back?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto flex min-h-dvh w-full min-w-0 ${width} flex-col px-4 py-10 sm:px-6`}>
      <header className="flex items-center justify-between gap-3">
        <Link href="/" aria-label="לעמוד הבית">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <ThemeToggle />
      </header>

      {back && (
        <Link href="/admin" className="mt-8 inline-flex min-h-11 w-fit items-center text-sm font-semibold underline underline-offset-4">
          ← פאנל הניהול
        </Link>
      )}
      <h1 className={`font-display ${back ? "" : "mt-8 "}text-3xl font-bold sm:text-4xl`}>{title}</h1>
      <p className="mt-2 leading-relaxed opacity-70">{intro}</p>

      {children}
      <div className="pb-10" />
    </div>
  );
}
