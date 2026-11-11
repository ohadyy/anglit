import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAskOhad, hasPaidAccess } from "@/lib/access";
import { buildAffixes, buildConnectors, buildFreeSet, buildSet, buildSingleStemPool, filterByLevel, levelCounts } from "@/lib/practice";
import { passages, type Passage, type Question, type QuestionType } from "@/content/questions";
import { ALL_TYPES, isQuestionType } from "@/content/questionLabels";
import { FREE_QUESTION_COUNT, isLevelGroup } from "@/content/practiceFacts";
import { PracticeClient, type PracticeMode } from "./PracticeClient";
import { ReadAloud } from "@/components/ReadAloud";
import { questionNotes } from "@/content/questionNotes";

export const metadata: Metadata = {
  title: "תרגול חינם",
  description: `${FREE_QUESTION_COUNT} שאלות אמירנט לדוגמה בחינם, עם הסבר מלא לכל תשובה. תרגול מלא בכל הסוגים במסלול בתשלום.`,
  // Guests (and Googlebot) are redirected to /start, which is the indexable page
  robots: { index: false },
};

export default async function PracticePage({ searchParams }: PageProps<"/practice">) {
  const { type, level } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;
  const canAsk = !!session && (await canAskOhad(session.user.id, session.user.phone));
  const mode: PracticeMode | undefined =
    type === "free" || type === "mistakes" || type === "connectors" || type === "affixes" ? type : isQuestionType(type) ? type : undefined;

  // The full practice page is for paid members only. Everyone else is routed through the
  // free-trial chooser at /start — except the explicit free-sample link, which stays open.
  // The mistakes page stays open too, so a free visitor sees how many mistakes wait for them.
  if (!paid && mode !== "free" && mode !== "mistakes") redirect("/start");

  const free = buildFreeSet();
  // Mistakes live on the device, so a paid member gets the whole bank and the browser picks them out
  const set: Question[] =
    !paid || !mode || mode === "free"
      ? []
      : mode === "mistakes"
        ? [...ALL_TYPES.flatMap(buildSet), ...buildAffixes()]
        : mode === "connectors"
          ? buildConnectors()
          : mode === "affixes"
            ? buildAffixes()
            : buildSet(mode);

  // The level picker exists only for the types whose questions are rated (sentence, restatement, reading)
  const all = mode && mode !== "free" && mode !== "mistakes" ? levelCounts(set) : null;
  const levelGroup = all && isLevelGroup(level) && all[level] > 0 ? level : undefined;
  const hasLevels = all !== null && Object.values(all).some((n) => n > 0);
  const picked = levelGroup ? filterByLevel(set, levelGroup) : set;

  const shown = [...free, ...picked];
  const usedPassages: Passage[] = passages.filter((p) => shown.some((q) => "passageId" in q && q.passageId === p.id));
  const counts = Object.fromEntries(ALL_TYPES.map((t) => [t, paid ? buildSet(t).length : 0])) as Record<QuestionType, number>;

  return (
    <>
      <ReadAloud />
      <PracticeClient
        mode={mode}
        data={{ paid, canAsk, free, set: picked, levelPicker: all && hasLevels ? { active: levelGroup, counts: all } : null, counts, dailyPool: !mode ? buildSingleStemPool() : [], passages: usedPassages, notes: questionNotes, lessonCounts: { connectors: buildConnectors().length, affixes: buildAffixes().length } }}
      />
    </>
  );
}
