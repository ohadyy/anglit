"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { crmNotes, crmState, leads } from "@/db/schema";
import { NOTE_LABEL, STATUS_LABEL, type CrmKind, type CrmStatus, type NoteType } from "./labels";
import { requireStaff } from "@/lib/access";
import { BAD_REQUEST, type ActionResult } from "../_shared";

const MAX_NOTE = 1000;
const MAX_BULK = 500;

// Server actions take whatever the browser sends, so every id and enum value is checked here.
function validTarget(kind: unknown, refId: unknown) {
  return (kind === "lead" || kind === "user") && typeof refId === "string" && refId.length > 0 && refId.length <= 64;
}

async function upsertState(kind: CrmKind, refId: string, patch: { status?: CrmStatus; followUpAt?: Date | null }) {
  await db
    .insert(crmState)
    .values({ kind, refId, ...patch })
    .onConflictDoUpdate({ target: [crmState.kind, crmState.refId], set: { ...patch, updatedAt: new Date() } });
}

export async function setStatus(kind: CrmKind, refId: string, status: CrmStatus): Promise<ActionResult> {
  await requireStaff();
  if (!validTarget(kind, refId) || !Object.hasOwn(STATUS_LABEL, status)) return BAD_REQUEST;

  await upsertState(kind, refId, { status });
  revalidatePath("/admin/crm");
  return { ok: true };
}

export async function setStatusMany(targets: { kind: CrmKind; refId: string }[], status: CrmStatus): Promise<ActionResult> {
  await requireStaff();
  if (!Array.isArray(targets) || targets.length === 0 || targets.length > MAX_BULK || !targets.every((t) => validTarget(t?.kind, t?.refId))) {
    return BAD_REQUEST;
  }
  if (!Object.hasOwn(STATUS_LABEL, status)) return BAD_REQUEST;

  // One row per person, or Postgres refuses to update the same row twice in one statement
  const unique = [...new Map(targets.map((t) => [`${t.kind}:${t.refId}`, { kind: t.kind, refId: t.refId, status }])).values()];
  await db
    .insert(crmState)
    .values(unique)
    .onConflictDoUpdate({ target: [crmState.kind, crmState.refId], set: { status, updatedAt: new Date() } });
  revalidatePath("/admin/crm");
  return { ok: true };
}

// `day` is YYYY-MM-DD, or null to clear the reminder.
export async function setFollowUp(kind: CrmKind, refId: string, day: string | null): Promise<ActionResult> {
  await requireStaff();
  if (!validTarget(kind, refId)) return BAD_REQUEST;
  if (day !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day)))) return BAD_REQUEST;

  await upsertState(kind, refId, { followUpAt: day ? new Date(`${day}T12:00:00Z`) : null });
  revalidatePath("/admin/crm");
  return { ok: true };
}

export async function addNote(kind: CrmKind, refId: string, type: NoteType, body: string): Promise<ActionResult> {
  await requireStaff();
  if (!validTarget(kind, refId) || !Object.hasOwn(NOTE_LABEL, type) || typeof body !== "string") return BAD_REQUEST;

  const text = body.trim();
  // A call or a WhatsApp message can be logged with no text; a plain note needs some.
  if (type === "note" && !text) return { ok: false, error: "צריך לכתוב משהו בהערה." };
  if (text.length > MAX_NOTE) return { ok: false, error: "ההערה ארוכה מדי. אפשר עד 1,000 תווים." };

  await db.insert(crmNotes).values({ kind, refId, type, body: text });
  revalidatePath("/admin/crm");
  return { ok: true };
}

export async function deleteNote(noteId: string): Promise<ActionResult> {
  await requireStaff();
  if (typeof noteId !== "string" || !noteId) return BAD_REQUEST;

  await db.delete(crmNotes).where(eq(crmNotes.id, noteId));
  revalidatePath("/admin/crm");
  return { ok: true };
}

// Only leads can be removed from here: a registered student is managed in /admin.
export async function deleteLead(leadId: string): Promise<ActionResult> {
  await requireStaff();
  if (!validTarget("lead", leadId)) return BAD_REQUEST;

  await db.delete(crmNotes).where(and(eq(crmNotes.kind, "lead"), eq(crmNotes.refId, leadId)));
  await db.delete(crmState).where(and(eq(crmState.kind, "lead"), eq(crmState.refId, leadId)));
  await db.delete(leads).where(eq(leads.id, leadId));
  revalidatePath("/admin/crm");
  return { ok: true };
}
