"use client";

import { createContext, useContext } from "react";
import type { Passage } from "@/content/questions";

// Passages the page was given by the server. Only the passages of the questions this
// visitor may see are passed in, so the rest of the bank never reaches the browser.
const PassageContext = createContext<Record<string, Passage>>({});

export function PassageProvider({ passages, children }: { passages: Passage[]; children: React.ReactNode }) {
  const map = Object.fromEntries(passages.map((p) => [p.id, p]));
  return <PassageContext.Provider value={map}>{children}</PassageContext.Provider>;
}

export function usePassage(id: string): Passage {
  const p = useContext(PassageContext)[id];
  if (!p) throw new Error(`passage ${id} was not sent to this page`);
  return p;
}
