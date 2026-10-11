// Purely decorative: a big faint brand letter/number plus a few hand-drawn,
// exam-margin-style doodles (underline, circled check, arrow). Sits behind the
// hero content — never carries information, so it's all aria-hidden.
export function HeroDecor({ mark, font = "sans" }: { mark: string; font?: "sans" | "gevora" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      <span
        className={`absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 text-[52vw] leading-none text-fg opacity-[0.05] sm:text-[30vw] ${
          font === "gevora" ? "font-gevora" : "font-bold"
        }`}
      >
        {mark}
      </span>

      <svg
        viewBox="0 0 120 24"
        fill="none"
        className="absolute bottom-[20%] start-[6%] h-7 w-24 text-fg opacity-25 sm:h-9 sm:w-32"
      >
        <path
          d="M2 16c10-10 20-10 30 0s20 10 30 0 20-10 30 0 20 10 26 2"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="absolute top-[20%] end-[10%] hidden h-16 w-16 text-fg opacity-20 sm:block"
      >
        <path
          d="M32 6c15 2 26 12 25 27-1 14-13 24-27 24S4 47 5 32 17 5 32 6Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M22 33l7 7 14-16"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        viewBox="0 0 100 60"
        fill="none"
        className="absolute bottom-[14%] end-[16%] hidden h-14 w-20 text-fg opacity-20 md:block"
      >
        <path d="M6 6c30 4 55 20 60 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M52 40l14 10-2-17"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
