import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { scoreExam } from "@/lib/examScore";
import { findExamTest, findPlatinumTest } from "@/content/examTests";
import { buildExam } from "@/lib/examStructure";
import { buildPlatinumExam } from "@/lib/platinumExam";
import { isCorrectAnswer } from "@/content/questions";
import { hasPaidAccess } from "@/lib/access";

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
    startedAt: string;
  } | null;
  if (!body || (body.kind !== "open" && body.kind !== "close")) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // Tests are fixed in the catalog, so the number only has to match one of them
  const platinum = findPlatinumTest(body.testNumber);
  if (!platinum && !findExamTest(body.testNumber)) {
    return NextResponse.json({ error: "invalid test number" }, { status: 400 });
  }

  // The score is worked out here from the real answer key, never from what the browser says
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
  const asked = (platinum ? buildPlatinumExam(body.testNumber) : buildExam(body.testNumber))
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
