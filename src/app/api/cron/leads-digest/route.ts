import { NextResponse } from "next/server";
import { notify } from "@/lib/ntfy";
import { countUncontactedLeads } from "@/lib/uncontactedLeads";

// Runs once a morning (vercel.json). A safety net for a missed live notification:
// every lead nobody has handled yet is counted again until its status changes in /admin/crm.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const count = await countUncontactedLeads();
  if (count > 0) {
    await notify("Leads waiting - Anglit", [`${count} לידים מחכים שתפנה אליהם`, "אדמין ← לידים ושיחות ← עוד לא פניתי"], "telephone_receiver");
  }
  return NextResponse.json({ ok: true, count });
}
