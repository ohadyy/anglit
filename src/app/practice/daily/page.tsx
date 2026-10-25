import type { Metadata } from "next";
import { questions, type Question } from "@/content/questions";
import { DailyQuestion } from "./DailyQuestion";

export const metadata: Metadata = {
  title: "שאלת היום",
  description: "שאלת אמירנט אחת ביום, עם הסבר מלא. עונים כל יום ושומרים על הרצף.",
};

// Single-stem types only, so the question fits on one screen without a passage.
// The browser picks today's question from this list by its own date.
const POOL: Question[] = questions.filter((q) => q.type === "sentence" || q.type === "restatement");

export default function DailyPage() {
  return <DailyQuestion pool={POOL} />;
}
