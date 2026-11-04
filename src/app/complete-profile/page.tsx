import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { safeNext } from "@/lib/safeNext";
import { CompleteProfileForm } from "./CompleteProfileForm";

export const metadata: Metadata = { title: "עוד פרט אחד", robots: { index: false } };

export default async function CompleteProfilePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  // Phone sign-ups and returning Google users already have one
  if (session.user.phone) redirect(next);
  return <CompleteProfileForm next={next} name={session.user.name} />;
}
