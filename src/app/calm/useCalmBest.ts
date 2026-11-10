"use client";

import { STORAGE_KEYS } from "@/lib/storageKeys";
import { useStored } from "@/lib/useStored";

export function useCalmBest() {
  return useStored(STORAGE_KEYS.calm, { thoughtsBest: 0, eliminateBest: 0 });
}
