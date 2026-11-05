import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isStaffPhone, paidProducts } from "@/lib/access";
import type { ProductId } from "@/content/pricingCopy";

// Who is looking at a public page, so the page can change with what they already have:
// guest (not signed in), free (signed in, paid nothing), access (paid for site access or
// private lessons), course (paid for the seminar, which includes site access).
export const TIERS = ["guest", "free", "access", "course"] as const;
export type Tier = (typeof TIERS)[number];

export type Viewer = {
  tier: Tier;
  name: string | null;
  /** Real paid products. Staff phones get site access but no products, so no loyalty discount */
  owned: ProductId[];
  staff: boolean;
};

const PREVIEW_OWNED: Record<Tier, ProductId[]> = { guest: [], free: [], access: ["access"], course: ["course"] };

/** `previewAs` lets staff see a page as any tier (?as=guest|free|access|course); ignored for everyone else */
export async function getViewer(previewAs?: string): Promise<Viewer> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { tier: "guest", name: null, owned: [], staff: false };

  const staff = isStaffPhone(session.user.phone ?? null);
  const preview = TIERS.find((t) => t === previewAs);
  if (staff && preview) {
    return { tier: preview, name: preview === "guest" ? null : session.user.name, owned: PREVIEW_OWNED[preview], staff };
  }

  const owned = await paidProducts(session.user.id);
  const tier: Tier = owned.includes("course") ? "course" : owned.length > 0 || staff ? "access" : "free";
  return { tier, name: session.user.name, owned, staff };
}

/** True when the course should be offered at the loyalty price */
export const isLoyal = (v: Viewer) => v.owned.length > 0 && !v.owned.includes("course");
