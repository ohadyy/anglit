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
