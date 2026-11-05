import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasCourse, hasPaidAccess } from "@/lib/access";
import { findExamTest } from "@/content/examTests";
import { seenPoolItems } from "@/lib/listedTests";
import { buildExam } from "@/lib/examStructure";
import { passages, type Passage } from "@/content/questions";
import { poolPassages } from "@/content/examPool";
import { ExamClient } from "../ExamClient";
import { ReadAloud } from "@/components/ReadAloud";
import { LockedExam } from "../LockedExam";
import { PassageProvider } from "@/components/PassageContext";

export const metadata: Metadata = {
  title: "מבחן תרגול",
  robots: { index: false },
};

export default async function ExamRunPage({ params }: PageProps<"/exam/[number]">) {
  const { number } = await params;
  const test = findExamTest(number);
  // Only the adaptive tests can be taken. The original (frozen) ones stay in students' history, nothing more.
  if (!test?.adaptive) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;
  const inCourse = session ? await hasCourse(session.user.id) : false;

  if (!test.free && !paid) {
    return <LockedExam />;
  }

  // An adaptive test avoids pool items this student already met in earlier tests
  const seen = session && test.adaptive ? await seenPoolItems(session.user.id) : [];
  const plan = buildExam(number, {}, seen);
  // An adaptive test picks its reading passage during the test, so it gets all pool passages
  const usedPassages: Passage[] = [
    ...passages.filter((p) => plan.some((part) => part.questions.some((q) => "passageId" in q && q.passageId === p.id))),
    ...(test.adaptive ? poolPassages : []),
  ];
  return (
    <>
      <ReadAloud />
      <PassageProvider passages={usedPassages}>
        <ExamClient plan={plan} kind="open" testNumber={number} freeUpsell={!paid} inCourse={inCourse} seen={seen} />
      </PassageProvider>
    </>
  );
}
