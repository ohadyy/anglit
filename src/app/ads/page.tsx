import type { Metadata } from "next";
import { SprintLanding } from "@/components/SprintLanding";
import { nextCohortInfo } from "@/lib/cohorts";
import { getProduct } from "@/content/pricingCopy";

// The price and seats change, so this page is read fresh on each visit
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getProduct("course")?.name,
  description: "סמינר הכנה לאמירנט בשבוע אחד, בקבוצה קטנה עם מורה, ותרגול כל יום.",
  // Indexed on its own address (the layout canonical points to the homepage).
  alternates: { canonical: "/ads" },
};

export default async function AdsPage() {
  return <SprintLanding cohort={await nextCohortInfo()} />;
}
