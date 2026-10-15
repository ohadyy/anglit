import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import Link from "next/link";

// A button with a pressable 3D face: a lighter top layer sits above a darker
// "base" layer, and the top layer slides down on press/hover to reveal it.
// https://www.dqnamo.com/experiments/tactile-button

const SIZE = {
  sm: "h-10 gap-1.5 px-5 text-sm",
  md: "h-12 gap-2 px-6 text-base",
  lg: "h-14 gap-2.5 px-7 text-lg",
} as const;

const DEPTH_VARS = {
  "--tactile-depth": "5px",
  "--tactile-radius": "9999px",
  "--tactile-face": "var(--fg)",
  "--tactile-face-highlight": "color-mix(in srgb, var(--fg) 82%, white 18%)",
  "--tactile-content": "var(--bg)",
  "--tactile-base": "color-mix(in srgb, var(--fg) 78%, black 22%)",
  "--tactile-base-shadow": "color-mix(in srgb, var(--fg) 55%, black 45%)",
} as CSSProperties;

const ROOT_CLASS =
  "group/tactile relative inline-grid shrink-0 select-none border-0 bg-transparent p-0 pb-[var(--tactile-depth)] leading-none disabled:pointer-events-none disabled:opacity-45";

function Layers({
  size,
  fullWidth,
  children,
}: {
  size: keyof typeof SIZE;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <span className="absolute inset-x-0 top-[var(--tactile-depth)] bottom-0 rounded-[var(--tactile-radius)] bg-[var(--tactile-base)] shadow-[inset_0_-1px_0_var(--tactile-base-shadow)]" />
      <span
        className={`relative flex items-center justify-center rounded-[var(--tactile-radius)] bg-[var(--tactile-face)] font-semibold text-[var(--tactile-content)] shadow-[inset_0_1px_0_var(--tactile-face-highlight)] transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-active/tactile:translate-y-[var(--tactile-depth)] motion-reduce:transform-none motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/tactile:translate-y-0.5 ${SIZE[size]} ${fullWidth ? "w-full" : ""}`}
      >
        {children}
      </span>
    </>
  );
}

type CommonProps = {
  size?: keyof typeof SIZE;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

export function TactileButton({
  size = "md",
  fullWidth,
  className = "",
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${ROOT_CLASS} ${fullWidth ? "w-full" : "w-max"} ${className}`}
      style={DEPTH_VARS}
    >
      <Layers size={size} fullWidth={fullWidth}>
        {children}
      </Layers>
    </button>
  );
}

export function TactileLink({
  href,
  size = "md",
  fullWidth,
  className = "",
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`${ROOT_CLASS} ${fullWidth ? "w-full" : "w-max"} ${className}`}
      style={DEPTH_VARS}
    >
      <Layers size={size} fullWidth={fullWidth}>
        {children}
      </Layers>
    </Link>
  );
}
