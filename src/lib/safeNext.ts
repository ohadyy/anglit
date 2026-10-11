// After sign-in or sign-up the visitor goes to ?next=. Only a path on this site is
// allowed: "https://evil.example" or "//evil.example" would send them to another site.
export function safeNext(raw: string | null | undefined, fallback = "/account"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}
