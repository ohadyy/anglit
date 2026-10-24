import type { Metadata } from "next";
import { JournalClient } from "./JournalClient";

export const metadata: Metadata = {
  title: "יומן הטעויות",
  robots: { index: false, follow: false },
};

export default function JournalPage() {
  return <JournalClient />;
}
