// Better Auth owns user/session/account/verification — regenerate with
// `npx @better-auth/cli generate --config src/lib/auth.ts --output src/db/auth-schema.ts -y`
// whenever the auth config changes. Anglit's own tables (cohorts, enrollments,
// orders) are defined below and reference `user` from there.
export * from "./auth-schema";

import { pgTable, text, integer, timestamp, jsonb, primaryKey, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { COHORT_STATUSES, LEAD_SOURCES, PRODUCT_IDS } from "../lib/enums";

// מחזור — one week-long cycle: a start date, an exam date, a seat cap.
export const cohorts = pgTable("cohorts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  startDate: timestamp("start_date").notNull(),
  examDate: timestamp("exam_date").notNull(),
  capacity: integer("capacity").notNull(),
  // Free text shown to students, e.g. "ראשון 19:00, שלישי 19:00". Null falls back to COHORT_SESSIONS.
  sessions: text("sessions"),
  status: text("status", { enum: COHORT_STATUSES })
    .notNull()
    .default("upcoming"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// A student's spot in a cohort, and their diagnostic scores.
export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cohortId: text("cohort_id")
    .notNull()
    .references(() => cohorts.id, { onDelete: "restrict" }),
  status: text("status", {
    enum: ["pending_payment", "active", "completed", "free_retry"],
  })
    .notNull()
    .default("pending_payment"),
  openTestScore: integer("open_test_score"),
  closeTestScore: integer("close_test_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// One Cardcom charge attempt. Amounts are in agorot (smallest ILS unit) to
// avoid float rounding. `cohortId` is legacy: an earlier flow tied a payment to a cohort,
// nothing writes it now, but old rows may still point at a cohort.
// `providerTransactionId` holds Cardcom's LowProfileId.
export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cohortId: text("cohort_id").references(() => cohorts.id, { onDelete: "restrict" }),
  amountAgorot: integer("amount_agorot").notNull(),
  product: text("product", { enum: PRODUCT_IDS }),
  currency: text("currency").notNull().default("ILS"),
  provider: text("provider").notNull().default("cardcom"),
  providerTransactionId: text("provider_transaction_id"),
  status: text("status", { enum: ["pending", "paid", "failed", "refunded"] })
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
  termsAcceptedAt: timestamp("terms_accepted_at"),
});

// One run of the timed diagnostic (open/close test). `answers` maps question
// id -> the chosen option index (or null if time ran out first).
// `estimatedScore` is OUR rough 50-150 estimate, not NITE's real algorithm —
// see src/lib/examScore.ts for why an exact match isn't possible.
export const examAttempts = pgTable("exam_attempts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["open", "close"] }).notNull(),
  answers: jsonb("answers").$type<Record<string, number | string | null>>().notNull(),
  rawCorrect: integer("raw_correct").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  estimatedScore: integer("estimated_score").notNull(),
  testNumber: text("test_number"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// A five-digit test number issued to a student. It stays with them until the test is submitted.
export const examTests = pgTable("exam_tests", {
  number: text("number").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["open", "close"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  usedAt: timestamp("used_at"),
});

// "Leave your details" — people who aren't ready to self-serve through
// sign-up/checkout yet. Not tied to a user account (they may not have one).
// Where a student is with each vocabulary word: box 1 (missed) to 3 (known well).
// No row means the word hasn't been practiced yet.
export const vocabProgress = pgTable(
  "vocab_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    wordId: text("word_id").notNull(),
    box: integer("box").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.wordId] })],
);

// A question the student currently has wrong, in /practice or in an exam's core chapters —
// mirrors the old localStorage-only version (src/lib/mistakes.ts). A correct answer, or
// "done" on the review page, deletes the row. No row means no outstanding mistake.
export const mistakes = pgTable(
  "mistakes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    chosenOption: integer("chosen_option"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] })],
);

export const leads = pgTable("leads", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  message: text("message"),
  source: text("source", { enum: LEAD_SOURCES }).notNull(),
  consent: boolean("consent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Where a person stands in the sales pipeline (/admin/crm). `kind` says whether refId is a
// leads.id or a user.id, so a lead and a registered student share one board, with no foreign
// key because of that. "Paid" is never stored here: it is read from orders.
export const crmState = pgTable(
  "crm_state",
  {
    kind: text("kind", { enum: ["lead", "user"] }).notNull(),
    refId: text("ref_id").notNull(),
    status: text("status", { enum: ["new", "no_answer", "talked_lost", "talked_interested", "talked_paid"] })
      .notNull()
      .default("new"),
    followUpAt: timestamp("follow_up_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.kind, t.refId] })],
);

// The activity log of one person: a call, a WhatsApp message, or a free note.
export const crmNotes = pgTable("crm_notes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  kind: text("kind", { enum: ["lead", "user"] }).notNull(),
  refId: text("ref_id").notNull(),
  type: text("type", { enum: ["call", "whatsapp", "note"] }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Checkout coupons made from /admin/coupons: either a percent off or a fixed final price, never both.
export const coupons = pgTable("coupons", {
  code: text("code").primaryKey(),
  percent: integer("percent"),
  priceIls: integer("price_ils"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
