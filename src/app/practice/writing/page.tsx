import type { Metadata } from "next";
import { WRITING_MINUTES } from "@/content/practiceFacts";
import { WritingPractice } from "./WritingPractice";

export const metadata: Metadata = {
  title: "תרגול מטלת כתיבה",
  description: `מטלת כתיבה באנגלית בזמן אמיתי: ${WRITING_MINUTES} דקות, הקלדה, וטקסט לדוגמה להשוואה אחרי שמסיימים.`,
};

export default function WritingPage() {
  return <WritingPractice />;
}
