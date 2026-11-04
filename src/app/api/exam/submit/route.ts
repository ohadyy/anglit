import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { scoreExam } from "@/lib/examScore";
import { EASY_TEST, findExamTest, findPlatinumTest } from "@/content/examTests";
import { buildExam } from "@/lib/examStructure";
import { poolLevels } from "@/content/examPool";
import { buildPlatinumExam } from "@/lib/platinumExam";
import { isCorrectAnswer } from "@/content/questions";
import { hasPaidAccess, isStaff } from "@/lib/access";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!(await hasPaidAccess(session.user.id))) {
    return NextResponse.json({ error: "payment required" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    kind: "open" | "close";
    testNumber: string;
    includePilot: boolean;
    answers: Record<string, number | string | null>;
    /** Pool items the page avoided as already seen; needed to rebuild the same adaptive test */
    seen?: unknown;
    startedAt: string;
  } | null;
  if (!body || (body.kind !== "open" && body.kind !== "close")) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // Tests are fixed in the catalog, so the number only has to match one of them
  const easy = body.testNumber === EASY_TEST;
  const platinum = findPlatinumTest(body.testNumber) || easy;
  if (!platinum && !findExamTest(body.testNumber)) {
    return NextResponse.json({ error: "invalid test number" }, { status: 400 });
  }
  if (easy && !(await isStaff(session.user.id))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // The score is worked out here from the real answer key, never from what the browser says
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
  // An adaptive test is rebuilt from the answers and the seen list, so its chapters match what
  // was shown. The seen list only steers which questions were picked; the score still comes
  // from the answer key here, so a tampered list cannot raise it.
  const seen = Array.isArray(body.seen) ? body.seen.filter((id): id is string => typeof id === "string" && id in poolLevels).slice(0, 2000) : [];
  const asked = (platinum ? buildPlatinumExam(body.testNumber) : buildExam(body.testNumber, answers, seen))
    .filter((part) => body.includePilot || !part.section.pilot)
    .flatMap((part) => part.questions);
  const correctness: Record<string, boolean> = {};
  for (const question of asked) {
    correctness[question.id] = isCorrectAnswer(question, answers[question.id]);
  }
  const score = scoreExam(correctness);

  const [attempt] = await db
    .insert(examAttempts)
    .values({
      userId: session.user.id,
      kind: body.kind,
      // Only answers to questions that were actually part of this test are stored
      answers: Object.fromEntries(asked.filter((q) => q.id in answers).map((q) => [q.id, answers[q.id]])),
      rawCorrect: score.rawCorrect,
      totalQuestions: score.totalQuestions,
      estimatedScore: score.estimatedScore,
      testNumber: body.testNumber,
      startedAt: new Date(body.startedAt),
    })
    .returning();

  return NextResponse.json({ id: attempt.id, ...score });
}
