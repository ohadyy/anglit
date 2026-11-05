import type { Metadata } from "next";
import { WritingPractice } from "./WritingPractice";

export const metadata: Metadata = {
  title: "תרגול מטלת כתיבה",
  description: "מטלת כתיבה באנגלית בזמן אמיתי: 12 דקות, הקלדה, וטקסט לדוגמה להשוואה אחרי שמסיימים.",
};

export default function WritingPage() {
  return <WritingPractice />;
}
