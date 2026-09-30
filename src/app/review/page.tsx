import type { Metadata } from "next";
import { ReviewClient } from "./ReviewClient";

export const metadata: Metadata = {
  title: "בדיקת מאגר השאלות",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return <ReviewClient />;
}
