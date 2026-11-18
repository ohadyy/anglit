"use client";

import { useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { useStored } from "@/lib/useStored";

// The exam date from sign-up fills the countdown on this device when the student has not picked one yet,
// so "N days left" shows up on /practice/daily and /exam-dates without asking again.
export function SyncExamDate({ date }: { date: string | null }) {
  const [stored, setStored] = useStored(STORAGE_KEYS.examDate, { date: "" });
  useEffect(() => {
    if (date && !stored.date) setStored({ date });
  }, [date, stored.date, setStored]);
  return null;
}
