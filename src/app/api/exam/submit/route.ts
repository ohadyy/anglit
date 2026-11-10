import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { scoreExam } from "@/lib/examScore";
import { findExamTest } from "@/content/examTests";
import { buildExam, planFor } from "@/lib/examStructure";
import { isPoolId } from "@/content/examPool";
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
    /** Pool items the page avoided as already seen; needed to rebuild the same adaptive test */
    seen?: unknown;
    startedAt: string;
  } | null;
  if (!body || (body.kind !== "open" && body.kind !== "close")) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // Tests are fixed in the catalog, so the number only has to match one of them
  if (!findExamTest(body.testNumber)) {
    return NextResponse.json({ error: "invalid test number" }, { status: 400 });
  }

  // The score is worked out here from the real answer key, never from what the browser says
  const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
  // An adaptive test is rebuilt from the answers and the seen list, so its chapters match what
  // was shown. The seen list only steers which questions were picked; the score still comes
  // from the answer key here, so a tampered list cannot raise it.
  const seen = Array.isArray(body.seen) ? body.seen.filter((id): id is string => typeof id === "string" && isPoolId(id)).slice(0, 2000) : [];
  const asked = planFor(buildExam(body.testNumber, answers, seen), body.includePilot).flatMap((part) => part.questions);
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
      // Only questions that were actually part of this test are stored. A question left blank
      // is stored as null, so the review can still show it (and it counts as met for `seen`).
      answers: Object.fromEntries(asked.map((q) => [q.id, answers[q.id] ?? null])),
      rawCorrect: score.rawCorrect,
      totalQuestions: score.totalQuestions,
      estimatedScore: score.estimatedScore,
      testNumber: body.testNumber,
      startedAt: new Date(body.startedAt),
    })
    .returning();

  return NextResponse.json({ id: attempt.id, ...score });
}
