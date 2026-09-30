import type { Metadata } from "next";
import { isQuestionType } from "@/lib/practice";
import { PracticeClient } from "./PracticeClient";

export const metadata: Metadata = {
  title: "תרגול חינם",
  description: "10 שאלות אמירנט מקוריות עם הסבר מלא לכל תשובה.",
};

export default async function PracticePage({ searchParams }: PageProps<"/practice">) {
  const { type } = await searchParams;
  return <PracticeClient type={isQuestionType(type) ? type : undefined} />;
}
