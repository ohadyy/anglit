import type { Metadata } from "next";
import { nextOpenCohortId } from "@/lib/cohorts";
import { DiploactJoinForm } from "./DiploactJoinForm";

export const metadata: Metadata = {
  title: "הרשמה חינם",
  robots: { index: false },
};

// Shows the live open cohort, so this page cannot be cached at build time
export const dynamic = "force-dynamic";

export default async function DiploactJoinPage() {
  const cohortId = await nextOpenCohortId();
  return <DiploactJoinForm cohortId={cohortId} />;
}
