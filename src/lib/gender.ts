// The student's own answer from /onboarding. Wording for a logged-in student follows it; everyone else (guests, "prefer not to say") gets the neutral plural.
export type Gender = "f" | "m";

export const isGender = (v: unknown): v is Gender => v === "f" || v === "m";

/** The wording for this student. `n` is the neutral form and the fallback when f or m is not given. */
export function pick<T>(gender: string | null | undefined, forms: { n: T; f?: T; m?: T }): T {
  return (isGender(gender) ? forms[gender] : undefined) ?? forms.n;
}
