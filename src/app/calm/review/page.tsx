import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalmReviewClient } from "./CalmReviewClient";

export const metadata: Metadata = {
  title: "בדיקת אזור אנג'לה",
  robots: { index: false, follow: false },
};

export default function CalmReviewPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <CalmReviewClient />;
}
