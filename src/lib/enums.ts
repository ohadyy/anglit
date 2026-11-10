// Value lists shared by the DB schema, the API validation and the admin screens.
// Pure (no imports), so client components can use it too.

export const LEAD_SOURCES = ["pricing", "sign-up", "ads"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export const isLeadSource = (v: unknown): v is LeadSource => LEAD_SOURCES.includes(v as LeadSource);

export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  pricing: "דף המחירים",
  "sign-up": "דף ההרשמה",
  ads: "דף הקמפיין",
};

export const COHORT_STATUSES = ["upcoming", "active", "closed"] as const;
export type CohortStatus = (typeof COHORT_STATUSES)[number];

export const PRODUCT_IDS = ["access", "course", "private"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

// Short names for the admin screens (the shopper-facing names live in content/pricingCopy)
export const PRODUCT_LABEL: Record<string, string> = { course: "קורס מלא", access: "גישה", private: "פרטי" };
