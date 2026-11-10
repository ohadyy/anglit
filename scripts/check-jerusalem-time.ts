// Run from anglit/: npx tsx scripts/check-jerusalem-time.ts
import assert from "node:assert/strict";
import { fromLocalInput, plusDays, toLocalInput } from "@/lib/jerusalemTime";

// A real row: the DB holds "2026-11-01 19:00:00" for a Sunday 19:00 lesson, which the driver reads as 19:00 UTC
assert.equal(toLocalInput(new Date("2026-11-01T19:00:00Z")), "2026-11-01T19:00");
assert.equal(fromLocalInput("2026-11-01T19:00")?.toISOString(), "2026-11-01T19:00:00.000Z");
assert.equal(fromLocalInput("garbage"), null);
assert.equal(fromLocalInput("2026-13-40T99:99"), null);
assert.equal(fromLocalInput("2026-02-31T10:00"), null);
assert.equal(plusDays("2026-11-01T19:00", 7), "2026-11-08T19:00");
assert.equal(plusDays("2026-10-28T19:00", 7), "2026-11-04T19:00");
console.log("jerusalemTime ok");
