// Type-only imports: this file is used by client components, which must not pull in the db client.
import type { crmNotes, crmState } from "@/db/schema";

export type CrmKind = (typeof crmState.$inferSelect)["kind"];
export type CrmStatus = (typeof crmState.$inferSelect)["status"];
export type NoteType = (typeof crmNotes.$inferSelect)["type"];
// "paid" is derived from orders, never stored
export type Stage = CrmStatus | "paid";

export const STATUS_LABEL: Record<CrmStatus, string> = {
  new: "עוד לא פניתי",
  no_answer: "לא ענה",
  talked_lost: "דיברנו, לא רלוונטי",
  talked_interested: "דיברנו, רוצה, עוד לא שילם",
  talked_paid: "דיברנו, שילם",
};

export const STAGE_LABEL: Record<Stage, string> = { ...STATUS_LABEL, paid: "שילם" };

// The colored dot next to each stage, from the site's own palette
export const STAGE_DOT: Record<Stage, string> = {
  new: "bg-coral",
  no_answer: "bg-warn",
  talked_lost: "bg-fg/30",
  talked_interested: "bg-marker",
  talked_paid: "bg-ok",
  paid: "bg-ok",
};

export const NOTE_LABEL: Record<NoteType, string> = { call: "שיחה", whatsapp: "וואטסאפ", note: "הערה" };

export const SOURCE_LABEL: Record<string, string> = {
  pricing: "דף המחירים",
  "sign-up": "דף ההרשמה",
  ads: "דף הקמפיין",
  account: "נרשם באתר",
};

export const PRODUCT_LABEL: Record<string, string> = { course: "קורס מלא", access: "גישה", private: "פרטי" };

export type Note = { id: string; type: NoteType; body: string; createdAt: Date };

export type Contact = {
  key: string;
  kind: CrmKind;
  refId: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  message: string | null;
  createdAt: Date;
  status: CrmStatus;
  // YYYY-MM-DD, a whole day with no time
  followUp: string | null;
  paid: boolean;
  products: string[];
  // Free access given by hand, not a payment
  manual: boolean;
  // A lead whose phone also has an account on the site
  registered: boolean;
  notes: Note[];
};

// Israeli local numbers (05x-xxxxxxx) to the international form wa.me expects
export function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? `972${digits.slice(1)}` : digits}`;
}
