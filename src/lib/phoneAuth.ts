// Login is phone number + birth date (see src/lib/auth.ts for why). Better
// Auth's core provider still expects an "email" — so every phone number
// normalizes to the same synthetic address, regardless of how it was typed
// (with/without +972, dashes, spaces).

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // "9725012345678" and "05012345678" must land on the same account.
  return digits.startsWith("972") ? "0" + digits.slice(3) : digits;
}

export function phoneToSyntheticEmail(rawPhone: string): string {
  return `${normalizePhone(rawPhone)}@phone.local`;
}

/** An Israeli number once normalized: a leading 0 and 9 or 10 digits in all */
export function isValidIlPhone(raw: string): boolean {
  return /^0\d{8,9}$/.test(normalizePhone(raw));
}

/** The looser check for the lead form, which also takes numbers from abroad: 9 to 12 digits */
export function looksLikePhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "").length;
  return digits >= 9 && digits <= 12;
}

/** International digits without the plus sign (05x... becomes 9725x...), as WhatsApp and Meta expect */
export function toInternational(raw: string): string {
  const local = normalizePhone(raw);
  return local.startsWith("0") ? `972${local.slice(1)}` : local;
}

/** wa.me link; without a number WhatsApp lets the sender pick a contact. `text` pre-fills the message. */
export function waLink(raw?: string, text?: string): string {
  return `https://wa.me/${raw ? toInternational(raw) : ""}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
