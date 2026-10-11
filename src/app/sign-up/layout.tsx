import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// A signed-in visitor has nothing to sign up for, so send them to their account
export default async function SignUpLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/account");
  return <>{children}</>;
}
