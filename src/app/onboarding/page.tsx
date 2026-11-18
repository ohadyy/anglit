import { Suspense } from "react";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "./OnboardingFlow";

// Only the sign-up funnel links here (checkout, sign-up, complete-profile), always with a `next` target.
// Someone who types the address by hand, or follows an old link, goes to the home page instead of answering questions for no account.
// (A visitor who already has a full account is sent to /account by the layout.)
export default async function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  const { next } = await searchParams;
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) redirect("/");
  return (
    <Suspense>
      <OnboardingFlow />
    </Suspense>
  );
}
