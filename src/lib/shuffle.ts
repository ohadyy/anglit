/** Fisher-Yates shuffle with a fresh random order each call. Client-side use only
 * (never during SSR), so the order never repeats between sessions. */
export function randomOrder<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
