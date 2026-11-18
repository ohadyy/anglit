// Read-only. Which questions does a cohort still have wrong, most common first. No names, no phones.
// Run: npx tsx --env-file=.env.local scripts/cohort-mistakes.ts [cohortId]   (no id = the latest cohort)
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { cohorts, enrollments, mistakes } from "@/db/schema";

async function main() {
  const all = await db.select().from(cohorts).orderBy(desc(cohorts.startDate));
  const cohort = process.argv[2] ? all.find((c) => c.id === process.argv[2]) : all[0];
  if (!cohort) throw new Error("no cohort found");
  const members = (await db.select({ id: enrollments.userId }).from(enrollments).where(eq(enrollments.cohortId, cohort.id))).map((m) => m.id);
  console.log(`cohort ${cohort.id} start ${cohort.startDate.toISOString()} students ${members.length}`);
  if (!members.length) return;

  const rows = await db.select({ q: mistakes.questionId, chosen: mistakes.chosenOption, u: mistakes.userId }).from(mistakes).where(inArray(mistakes.userId, members));
  const byQuestion = new Map<string, { students: Set<string>; picks: Map<number | null, number> }>();
  for (const r of rows) {
    const e = byQuestion.get(r.q) ?? { students: new Set(), picks: new Map() };
    e.students.add(r.u);
    e.picks.set(r.chosen, (e.picks.get(r.chosen) ?? 0) + 1);
    byQuestion.set(r.q, e);
  }
  const ranked = [...byQuestion].map(([q, e]) => ({ q, students: e.students.size, picks: Object.fromEntries(e.picks) })).sort((a, b) => b.students - a.students).slice(0, 25);
  console.log(JSON.stringify(ranked, null, 1));
  console.log(`students with at least one open mistake: ${new Set(rows.map((r) => r.u)).size}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
