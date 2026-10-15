import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { buildFreeSet, buildSet, isQuestionType } from "@/lib/practice";
import { passages, type Passage, type Question, type QuestionType } from "@/content/questions";
import { ALL_TYPES } from "@/content/questionLabels";
import { PracticeClient, type PracticeMode } from "./PracticeClient";
import { ReadAloud } from "@/components/ReadAloud";
import { questionNotes } from "@/content/questionNotes";

export const metadata: Metadata = {
  title: "תרגול חינם",
  description: "5 שאלות אמירנט לדוגמה בחינם, עם הסבר מלא לכל תשובה. תרגול מלא בכל הסוגים במסלול בתשלום.",
};

export default async function PracticePage({ searchParams }: PageProps<"/practice">) {
  const { type } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;
  const mode: PracticeMode | undefined =
    type === "free" || type === "mistakes" ? type : isQuestionType(type) ? type : undefined;

  // The full practice page is for paid members only. Everyone else is routed through the
  // free-trial chooser at /start — except the explicit free-sample link, which stays open.
  // The mistakes page stays open too, so a free visitor sees how many mistakes wait for them.
  if (!paid && mode !== "free" && mode !== "mistakes") redirect("/start");

  // Only what this visitor may see is read from the bank and sent to the browser
  const free = buildFreeSet();
  // Mistakes live on the device, so a paid member gets the whole bank and the browser picks them out
  const set: Question[] = !paid || !mode || mode === "free" ? [] : mode === "mistakes" ? ALL_TYPES.flatMap(buildSet) : buildSet(mode);
  const shown = [...free, ...set];
  const usedPassages: Passage[] = passages.filter((p) => shown.some((q) => "passageId" in q && q.passageId === p.id));
  const counts = Object.fromEntries(ALL_TYPES.map((t) => [t, paid ? buildSet(t).length : 0])) as Record<QuestionType, number>;

  return (
    <>
      <ReadAloud />
      <PracticeClient
        mode={mode}
        data={{ paid, free, set, counts, passages: usedPassages, notes: questionNotes }}
      />
    </>
  );
}
