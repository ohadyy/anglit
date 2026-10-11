import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

// Login is phone number + birth date instead of email + a real password —
// the owner wants zero-friction sign-up and to capture both for birthday
// greetings/discounts. Internally this still runs on Better Auth's
// email+password provider: the phone number is normalized into a synthetic
// "<digits>@phone.local" address (see src/lib/phoneAuth.ts), and the birth
// date is used as the password. `phone` and `birthDate` are stored as their
// own real fields too, so they're actually queryable later — not just baked
// into a one-way password hash.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  // Five sign-in attempts per 15 minutes, stored in the database so the count is shared
  // by all serverless instances (the default in-memory counter is per instance)
  rateLimit: {
    enabled: true,
    window: 15 * 60,
    max: 100,
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 15 * 60, max: 5 },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      phone: { type: "string", required: true, unique: true },
      birthDate: { type: "string", required: true },
      termsAccepted: { type: "boolean", required: false, defaultValue: false, input: true },
      marketingConsent: { type: "boolean", required: false, defaultValue: false, input: true },
      // Asked in a one-time gate right after sign-up, so follow-up WhatsApp messages can
      // reference a real date/score instead of being generic. Both optional — most people
      // signing up haven't taken the exam yet or don't know a date.
      examDate: { type: "string", required: false, input: true },
      priorScore: { type: "number", required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      update: {
        // The phone number decides the login and the staff role, and the birth date is the password.
        // A signed-in user must not be able to change either one through the update endpoint.
        before: async (data) => {
          if ("phone" in data || "birthDate" in data) return false;
          return { data };
        },
      },
    },
  },
});
