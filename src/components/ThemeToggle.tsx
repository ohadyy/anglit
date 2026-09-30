"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === "ink" ? "רקע בהיר" : "רקע כחול";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`מעבר ל${next}`}
      title={next}
      className={`grid size-10 place-items-center rounded-full border border-line hover:bg-fg/5 ${className}`}
    >
      {/* Half-filled circle: the two themes side by side */}
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
      </svg>
    </button>
  );
}
