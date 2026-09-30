import Image from "next/image";

// Each logo ships in both colors; CSS shows the one that fits the theme.

export function Wordmark({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <>
      <Image
        src="/brand/wordmark-dark.png"
        alt="Anglit"
        width={1576}
        height={481}
        priority
        className={`ink:hidden ${className}`}
      />
      <Image
        src="/brand/wordmark-light.png"
        alt="Anglit"
        width={1576}
        height={481}
        priority
        className={`hidden ink:block ${className}`}
      />
    </>
  );
}

export function Mark({ className = "size-8" }: { className?: string }) {
  return (
    <>
      <Image
        src="/brand/mark-dark.png"
        alt=""
        width={938}
        height={896}
        className={`object-contain ink:hidden ${className}`}
      />
      <Image
        src="/brand/mark-light.png"
        alt=""
        width={938}
        height={896}
        className={`hidden object-contain ink:block ${className}`}
      />
    </>
  );
}
