import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { findExamTest } from "@/content/examTests";
import { buildExam } from "@/lib/examStructure";
import { passages, type Passage } from "@/content/questions";
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
  if (!test) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;

  if (!test.free && !paid) {
    return <LockedExam />;
  }

  const plan = buildExam(number);
  const usedPassages: Passage[] = passages.filter((p) =>
    plan.some((part) => part.questions.some((q) => "passageId" in q && q.passageId === p.id)),
  );
  return (
    <>
      <ReadAloud />
      <PassageProvider passages={usedPassages}>
        <ExamClient plan={plan} kind="open" testNumber={number} />
      </PassageProvider>
    </>
  );
}
