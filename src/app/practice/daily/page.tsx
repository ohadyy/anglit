import type { Metadata } from "next";
import { buildDailyPool } from "@/lib/practice";
import { DailyQuestion } from "./DailyQuestion";

export const metadata: Metadata = {
  title: "שאלת היום",
  description: "שאלת אמירנט אחת ביום, עם הסבר מלא. עונים כל יום ושומרים על הרצף.",
};

// The browser picks today's question from this list by its own date.
export default function DailyPage() {
  return <DailyQuestion pool={buildDailyPool()} />;
}
