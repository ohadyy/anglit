import { eq } from "drizzle-orm";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { poolLevels } from "@/content/examPool";
import type { ExamTestDef } from "@/content/examTests";

/** Every test number that anyone has ever submitted. Read only the numbers, nothing per user. */
export async function attemptedTestNumbers(): Promise<Set<string>> {
  const rows = await db.selectDistinct({ number: examAttempts.testNumber }).from(examAttempts);
  return new Set(rows.flatMap((r) => (r.number ? [r.number] : [])));
}

/** The new adaptive tests and the free test are always on the site. An original (frozen)
 * test stays only if at least one student has taken it, so nobody's history points at a
 * test that disappeared; the untouched ones are dropped to keep the list short. */
export function isListed(test: ExamTestDef, attempted: Set<string>): boolean {
  return !!test.adaptive || !!test.free || attempted.has(test.number);
}

/** The exam-pool items this student has already answered in earlier tests, once per test,
 * so an adaptive test can pick fresh ones and repeat the least-met first (lib/examStructure.ts) */
export async function seenPoolItems(userId: string): Promise<string[]> {
  const rows = await db.select({ answers: examAttempts.answers }).from(examAttempts).where(eq(examAttempts.userId, userId));
  return rows.flatMap((r) => Object.keys(r.answers ?? {}).filter((id) => id in poolLevels));
}
