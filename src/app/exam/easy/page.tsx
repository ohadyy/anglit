import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/access";
import { EASY_TEST } from "@/content/examTests";
import { buildPlatinumExam, platinumPassage } from "@/lib/platinumExam";
import { ExamClient } from "../ExamClient";
import { ReadAloud } from "@/components/ReadAloud";
import { PassageProvider } from "@/components/PassageContext";

export const metadata: Metadata = {
  title: "מבחן קל (מנהל)",
  robots: { index: false },
};

// Admin-only warm-up test: starts at a basic level and rises to the level of the regular tests.
export default async function EasyExamPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !(await isStaff(session.user.id))) notFound();

  return (
    <>
      <ReadAloud />
      <PassageProvider passages={[platinumPassage(EASY_TEST)]}>
        <ExamClient plan={buildPlatinumExam(EASY_TEST)} kind="open" testNumber={EASY_TEST} />
      </PassageProvider>
    </>
  );
}
