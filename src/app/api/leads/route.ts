import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { sendTemplate } from "@/lib/whatsapp";
import { notify } from "@/lib/ntfy";

const SOURCE_LABEL: Record<"pricing" | "sign-up", string> = {
  pricing: "דף המחירים",
  "sign-up": "דף ההרשמה",
};

function notifyNewLead(lead: { name: string; contact: string; message: string | null; source: string }) {
  return notify("New lead - Anglit", [
    `שם: ${lead.name}`,
    `טלפון/אימייל: ${lead.contact}`,
    `מקור: ${lead.source}`,
    ...(lead.message ? [`הודעה: ${lead.message}`] : []),
  ]);
}

// Length limits, so a script cannot fill the table or the notifications with long text
const MAX_NAME = 100;
const MAX_CONTACT = 100;
const MAX_MESSAGE = 1000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const { name, contact, message, source, consent } = body as {
    name?: unknown;
    contact?: unknown;
    message?: unknown;
    source?: unknown;
    consent?: unknown;
  };

  const validText =
    typeof name === "string" &&
    typeof contact === "string" &&
    (message === undefined || message === null || typeof message === "string");
  const contactDigits = typeof contact === "string" ? contact.replace(/\D/g, "") : "";
  // Either a phone number (9 to 12 digits) or an email address
  const validContact = contactDigits.length >= 9 && contactDigits.length <= 12 || (typeof contact === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact));
  if (
    !validText ||
    !name.trim() ||
    name.length > MAX_NAME ||
    !contact.trim() ||
    contact.length > MAX_CONTACT ||
    !validContact ||
    (typeof message === "string" && message.length > MAX_MESSAGE) ||
    consent !== true ||
    (source !== "pricing" && source !== "sign-up")
  ) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  await db.insert(leads).values({ name, contact, message: message || null, source, consent: true });
  await notifyNewLead({ name, contact, message: message || null, source: SOURCE_LABEL[source] });
  if (process.env.WHATSAPP_OWNER_PHONE) {
    try {
      await sendTemplate(process.env.WHATSAPP_OWNER_PHONE, process.env.WHATSAPP_TEMPLATE_LEAD ?? "new_lead", [name, contact, SOURCE_LABEL[source]]);
    } catch (err) {
      console.error("[leads] owner WhatsApp failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
