import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "כמה שאלות קצרות",
  robots: { index: false },
};

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  // A new Google user is signed in but has no phone yet: they still answer the questions, then finish their profile
  if (session?.user.phone) redirect("/account");
  return <>{children}</>;
}
