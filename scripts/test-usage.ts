// Which practice tests are on the site, and which original tests are hidden because nobody
// ever submitted them (same rule as the site, lib/listedTests.ts). Reads only test numbers
// and counts from the live database, nothing about any student.
// Run from anglit/:  npx tsx --env-file=.env.local scripts/test-usage.ts

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { examAttempts } from "@/db/schema";
import { examTests } from "@/content/examTests";
import { isListed } from "@/lib/listedTests";

// Wrapped in a function: this project compiles scripts as CommonJS, which has no top-level await
async function main() {
  const rows = await db
    .select({ number: examAttempts.testNumber, attempts: sql<number>`count(*)::int` })
    .from(examAttempts)
    .groupBy(examAttempts.testNumber);
  const count = new Map(rows.map((r) => [r.number ?? "", r.attempts]));
  const attempted = new Set([...count.keys()].filter(Boolean));

  console.log("test   kind      submissions  on site");
  for (const t of examTests) {
    const kind = t.adaptive ? "new" : t.free ? "old, free" : "old";
    console.log(`${t.number}  ${kind.padEnd(9)} ${String(count.get(t.number) ?? 0).padStart(11)}  ${isListed(t, attempted) ? "yes" : "HIDDEN"}`);
  }
  const hidden = examTests.filter((t) => !isListed(t, attempted));
  console.log(`\n${hidden.length} hidden: ${hidden.map((t) => t.number).join(", ") || "none"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
