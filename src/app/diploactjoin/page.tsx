import type { Metadata } from "next";
import { primarySeatsLeft } from "@/lib/cohorts";
import { DiploactJoinForm } from "./DiploactJoinForm";

export const metadata: Metadata = {
  title: "הרשמה חינם",
  robots: { index: false },
};

// Shows the live seat count, so this page cannot be cached at build time
export const dynamic = "force-dynamic";

export default async function DiploactJoinPage() {
  const seatsLeft = await primarySeatsLeft();
  return <DiploactJoinForm seatsLeft={seatsLeft} />;
}
