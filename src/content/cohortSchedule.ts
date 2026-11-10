// The sessions every cohort follows. Kept in a plain file so both the server (WhatsApp confirmation)
// and the account page (client) can read the same text.
export const COHORT_SESSIONS = "ראשון, שלישי וראשון,";

// Limits for a cohort's capacity and sessions text, checked by the admin form and again on the server
export const MAX_COHORT_CAPACITY = 50;
export const MAX_SESSIONS_LENGTH = 120;
