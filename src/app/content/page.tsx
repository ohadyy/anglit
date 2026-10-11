import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentClient } from "./ContentClient";

export const metadata: Metadata = {
  title: "בחירת טקסטים",
  robots: { index: false, follow: false },
};

export default function ContentPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <ContentClient />;
}
