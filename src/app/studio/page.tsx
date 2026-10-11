import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/access";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  title: "סטודיו צילום",
  robots: { index: false, follow: false },
};

// The studio shows questions with their answers, so only staff accounts may open it.
// Anyone else gets a plain 404, and a logged-out visitor is sent to sign in first.
export default async function StudioPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?next=/studio");
  if (!(await isStaff(session.user.id))) notFound();
  return <StudioClient />;
}
