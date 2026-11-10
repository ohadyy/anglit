import { businessDetails } from "@/content/legal";
import type { Question } from "@/content/questions";
import { waLink } from "@/lib/phoneAuth";

/** A wa.me link to Ohad with the question, its options and the student's pick already typed in. */
export function askOhadLink(q: Question, selected: number | null): string {
  // Listening and reading questions depend on a clip or text that is too long to paste: name it instead
  const source =
    "passageId" in q ? `קטע: ${q.passageId}${q.type === "reading" && q.paragraph ? `, פסקה ${q.paragraph}` : ""}` : null;

  const lines = [
    `היי אהד, יש לי שאלה על השאלה הזאת (${q.id}):`,
    ...(source ? [source] : []),
    "",
    q.stem,
    ...q.options.map((option, i) => `${i + 1}. ${option}`),
    "",
    ...(selected !== null ? [`בחרתי: ${selected + 1}`] : []),
    `התשובה באתר: ${q.answer + 1}`,
    "",
    "מה שלא הבנתי: ",
  ];
  return waLink(businessDetails.phone, lines.join("\n"));
}
