import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewClient } from "./ReviewClient";

export const metadata: Metadata = {
  title: "בדיקת מאגר השאלות",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <ReviewClient />;
}
