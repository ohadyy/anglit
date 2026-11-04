import { and, count, eq, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { crmState, leads } from "@/db/schema";

// Leads nobody has marked yet: no CRM row at all, or still "עוד לא פניתי".
// A lead who later paid is still counted here until someone marks them, a small over-count on purpose.
export async function countUncontactedLeads() {
  const [row] = await db
    .select({ n: count() })
    .from(leads)
    .leftJoin(crmState, and(eq(crmState.kind, "lead"), eq(crmState.refId, leads.id)))
    .where(or(isNull(crmState.status), eq(crmState.status, "new")));
  return row.n;
}
