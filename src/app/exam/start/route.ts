import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { examTests } from "@/content/examTests";

// The "start a test" button of /exam. The test is drawn here, at the press, so every press is a fresh
// draw. Only the adaptive tests are in it; the original (frozen) tests can no longer be taken.
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;
  const adaptive = examTests.filter((t) => t.adaptive);
  const pick = adaptive[Math.floor(Math.random() * adaptive.length)];
  // Without paid access /exam shows the free test instead, so there is nothing to draw
  return NextResponse.redirect(new URL(paid ? `/exam/${pick.number}` : "/exam", request.url));
}
