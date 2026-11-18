// Read-only. Per-student numbers for the seminar-ending personal cards. Prints first names only (no phone/email).
// Run: npx tsx --env-file=.env.local scripts/personal-cards-data.ts <cohortIdPrefix> > out.json
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { findQuestion } from "@/lib/examQuestions";
import { cohorts, enrollments, mistakes, user, vocabProgress, examAttempts } from "@/db/schema";

// sc/sy/sx/ph-sc = sentence completion; cn = connectors; af = affixes; rs/rx/ry/ph-rs = restatement; rc*/ph-rc* = reading
const TYPE = (q: string) =>
  /^cn-/.test(q) ? "connectors" : /^af-/.test(q) ? "affixes" : /^(sc|sy|sx|ph-sc)-/.test(q) ? "sentence" : /^(rs|rx|ry|ph-rs)-/.test(q) ? "restatement" : /^(rc|ph-rc)/.test(q) ? "reading" : "other:" + q.replace(/[-_]?\d.*$/, "");

async function main() {
  const all = await db.select().from(cohorts);
  const c = all.find((x) => x.id.startsWith(process.argv[2] ?? ""));
  if (!c) throw new Error("no cohort");
  const en = await db.select().from(enrollments).where(eq(enrollments.cohortId, c.id));
  const ids = en.map((e) => e.userId);
  const users = await db.select().from(user).where(inArray(user.id, ids));
  const ms = await db.select().from(mistakes).where(inArray(mistakes.userId, ids));
  const vp = await db.select().from(vocabProgress).where(inArray(vocabProgress.userId, ids));
  const ea = await db.select().from(examAttempts).where(inArray(examAttempts.userId, ids));
  const out = en.map((e) => {
    const u = users.find((x) => x.id === e.userId)!;
    const mine = ms.filter((m) => m.userId === e.userId);
    const types: Record<string, number> = {};
    for (const m of mine) types[TYPE(m.questionId)] = (types[TYPE(m.questionId)] ?? 0) + 1;
    const boxes: Record<number, number> = {};
    for (const v of vp.filter((v) => v.userId === e.userId)) boxes[v.box] = (boxes[v.box] ?? 0) + 1;
    const att = ea.filter((a) => a.userId === e.userId).map((a) => ({ kind: a.kind, score: a.estimatedScore, raw: a.rawCorrect, of: a.totalQuestions, at: a.completedAt }));
    // Right/total per question type over every finished test (the answer key is the question bank's)
    const typeStats: Record<string, { right: number; total: number }> = {};
    for (const a of ea.filter((a) => a.userId === e.userId)) {
      for (const [id, v] of Object.entries(a.answers ?? {})) {
        const q = findQuestion(id);
        if (!q || q.type === ("writing" as string)) continue;
        const ok = q.type === "wordformation" ? typeof v === "string" && q.accepted.includes(v.trim().toLowerCase()) : v === q.answer;
        const t = (typeStats[q.type] ??= { right: 0, total: 0 });
        t.total++;
        if (ok) t.right++;
      }
    }
    return { typeStats, first: u.name.split(" ")[0], gender: u.gender, examDate: u.examDate, prior: u.priorScore, target: u.targetScore, open: e.openTestScore, close: e.closeTestScore, status: e.status, mistakesByType: types, mistakeTotal: mine.length, vocabBoxes: boxes, attempts: att };
  });
  console.log(JSON.stringify({ cohort: c.id, start: c.startDate, exam: c.examDate, students: out }, null, 1));
}
main().catch((e) => { console.error(e); process.exit(1); });
