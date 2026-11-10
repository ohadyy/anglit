/** Fisher-Yates shuffle with a fresh random order each call. Client-side use only
 * (never during SSR), so the order never repeats between sessions. */
export function randomOrder<T>(items: T[]): T[] {
  return shuffle(items, Math.random);
}

/** Like randomOrder, but questions that share a listening clip stay together, in bank order,
 * so a clip is played once and its 1–3 questions follow each other. Everything else is shuffled singly. */
export function randomOrderByClip<T extends { id: string; type: string; passageId?: string }>(items: T[]): T[] {
  const units: T[][] = [];
  const byClip = new Map<string, T[]>();
  for (const q of items) {
    if (q.type !== "listening" || !q.passageId) {
      units.push([q]);
    } else if (byClip.has(q.passageId)) {
      byClip.get(q.passageId)!.push(q);
    } else {
      const unit = [q];
      byClip.set(q.passageId, unit);
      units.push(unit);
    }
  }
  return randomOrder(units).flat();
}

/** Small seeded PRNG (mulberry32), so one seed always gives the same sequence.
 * Exam tests are built from it: changing it changes which questions every test gets. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: T[], rand: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Same order for the same seed (mulberry32). Not stored anywhere: the challenge pool and the
 * word-chain options only need to be stable between server and client render. */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  return shuffle(items, seededRandom(seed));
}
