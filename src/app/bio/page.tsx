import type { Metadata } from "next";
import { SprintLanding } from "@/components/SprintLanding";
import { upcomingCourseOffer } from "@/lib/cohorts";

// The price and seats change, so this page is read fresh on each visit
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "7 ימים לאמירנט",
  description: "סמינר הכנה לאמירנט בשבוע אחד, בקבוצה קטנה עם מורה, ותרגול כל יום.",
};

export default async function BioPage() {
  const offer = await upcomingCourseOffer();
  return <SprintLanding offer={offer} />;
}
