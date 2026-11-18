"use client";

import { useSession } from "./auth-client";

/** The logged-in student's gender ("f" | "m"), or null for guests and for "other": pass it to pick() in lib/gender.ts */
export function useGender(): string | null {
  return useSession().data?.user.gender ?? null;
}
