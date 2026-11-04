import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { findExamTest } from "@/content/examTests";
import { attemptedTestNumbers, isListed, seenPoolItems } from "@/lib/listedTests";
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
  // An original test nobody ever took is off the site, link included
  if (!test || !isListed(test, await attemptedTestNumbers())) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;

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
        <ExamClient plan={plan} kind="open" testNumber={number} freeUpsell={!paid} seen={seen} />
      </PassageProvider>
    </>
  );
}
