// Browser storage that never throws: it can be blocked (private window, cleared site data), and every caller
// treats that as "nothing stored". Client-only, like the storage it wraps.

type Area = "local" | "session";
const area = (a: Area) => (a === "local" ? localStorage : sessionStorage);

export function getItem(key: string, a: Area = "local"): string | null {
  try {
    return area(a).getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string, a: Area = "local") {
  try {
    area(a).setItem(key, value);
  } catch {}
}

export function removeItem(key: string, a: Area = "local") {
  try {
    area(a).removeItem(key);
  } catch {}
}

/** The stored JSON value, or undefined when missing, damaged or storage is blocked */
export function getJson(key: string, a: Area = "local"): unknown {
  try {
    const raw = area(a).getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}
