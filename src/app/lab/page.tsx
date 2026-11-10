import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabClient } from "./LabClient";

export const metadata: Metadata = {
  title: "מעבדה: לפני ואחרי",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <LabClient />;
}
