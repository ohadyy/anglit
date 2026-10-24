import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { mistakes } from "@/db/schema";

// Server mirror of the old localStorage-only mistakes list (src/lib/mistakes.ts), so a
// cleared browser or a new device doesn't lose a student's saved mistakes.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rows = await db
    .select({ questionId: mistakes.questionId, chosenOption: mistakes.chosenOption })
    .from(mistakes)
    .where(eq(mistakes.userId, session.user.id));

  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.questionId, r.chosenOption])));
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    answers?: Record<string, { correct: boolean; chosen: number | null }>;
  } | null;
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") return NextResponse.json({ error: "invalid" }, { status: 400 });

  await Promise.all(
    Object.entries(answers).map(([questionId, { correct, chosen }]) =>
      correct
        ? db.delete(mistakes).where(and(eq(mistakes.userId, session.user.id), eq(mistakes.questionId, questionId)))
        : db
            .insert(mistakes)
            .values({ userId: session.user.id, questionId, chosenOption: chosen ?? null })
            .onConflictDoUpdate({
              target: [mistakes.userId, mistakes.questionId],
              set: { chosenOption: chosen ?? null, updatedAt: new Date() },
            }),
    ),
  );

  return NextResponse.json({ ok: true });
}
