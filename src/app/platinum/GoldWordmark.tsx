// The long Anglit logo in gold: the PNG is used as a mask, so the gold gradient shows only where the logo is
export function GoldWordmark({ className = "h-9" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Anglit"
      className={`block aspect-[1576/481] bg-gradient-to-r from-[#8a6a26] via-[#f3dc9a] to-[#c9a24b] ${className}`}
      style={{
        WebkitMask: "url(/brand/wordmark-dark.png) center / contain no-repeat",
        mask: "url(/brand/wordmark-dark.png) center / contain no-repeat",
      }}
    />
  );
}
