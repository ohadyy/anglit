import type { Metadata } from "next";
import { requireStaffSession } from "@/lib/access";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  title: "סטודיו צילום",
  robots: { index: false, follow: false },
};

// The studio shows questions with their answers, so only staff accounts may open it.
// Anyone else gets a plain 404, and a logged-out visitor is sent to sign in first.
export default async function StudioPage() {
  await requireStaffSession("/studio");
  return <StudioClient />;
}
