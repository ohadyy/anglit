import { eq } from "drizzle-orm";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { poolLevels } from "@/content/examPool";

/** The exam-pool items this student has already answered in earlier tests, once per test,
 * so an adaptive test can pick fresh ones and repeat the least-met first (lib/examStructure.ts) */
export async function seenPoolItems(userId: string): Promise<string[]> {
  const rows = await db.select({ answers: examAttempts.answers }).from(examAttempts).where(eq(examAttempts.userId, userId));
  return rows.flatMap((r) => Object.keys(r.answers ?? {}).filter((id) => id in poolLevels));
}
