"use client";

import { useEffect, useState } from "react";

// A rail of section links that stays under the header while a long page scrolls, and marks the section
// being read. On a phone it is one row that scrolls sideways, with the active pill kept in view.
export function ScrollIndex({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      // The last section whose top has passed the line just under the header
      let current = items[0]?.id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  useEffect(() => {
    const pill = document.querySelector<HTMLElement>(`[data-scroll-index="${active}"]`);
    pill?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  return (
    <nav aria-label="בעמוד הזה" className="sticky top-[5.5rem] z-20 -mx-4 mt-6 bg-bg/90 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-full sm:px-2">
      <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map(({ id, label }) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              data-scroll-index={id}
              aria-current={active === id ? "location" : undefined}
              className={`flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors ${
                active === id ? "border-fg bg-fg font-semibold text-bg" : "border-line hover:bg-fg/5"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
