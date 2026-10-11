import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { findExamTest } from "@/content/examTests";
import { buildExam } from "@/lib/examStructure";
import { ExamClient } from "../ExamClient";
import { ReadAloud } from "@/components/ReadAloud";
import { LockedExam } from "../LockedExam";

export const metadata: Metadata = {
  title: "מבחן תרגול",
  robots: { index: false },
};

export default async function ExamRunPage({ params }: PageProps<"/exam/[number]">) {
  const { number } = await params;
  const test = findExamTest(number);
  if (!test) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/sign-in?next=/exam/${number}`);

  if (!test.free && !(await hasPaidAccess(session.user.id))) {
    return <LockedExam />;
  }

  const plan = buildExam(number);
  return (
    <>
      <ReadAloud />
      <ExamClient plan={plan} kind="open" testNumber={number} />
    </>
  );
}
