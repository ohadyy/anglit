import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function InternalHeader({ className = "" }: { className?: string }) {
  return (
    <header className={`mx-auto flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6 ${className}`}>
      <Link href="/" aria-label="לעמוד הבית">
        <Wordmark className="h-6 w-auto" />
      </Link>
      <ThemeToggle />
    </header>
  );
}
