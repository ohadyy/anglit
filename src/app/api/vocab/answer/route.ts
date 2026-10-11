import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { approvedWords, FREE_WORD_LIMIT, nextBox } from "@/lib/vocab";
import { vocabulary } from "@/content/vocabulary";
import { db } from "@/db";
import { vocabProgress } from "@/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const paid = await hasPaidAccess(session.user.id);

  const body = (await request.json().catch(() => null)) as { wordId?: unknown; knew?: unknown } | null;
  const wordId = typeof body?.wordId === "string" ? body.wordId : null;
  const knew = typeof body?.knew === "boolean" ? body.knew : null;
  if (!wordId || knew === null || !vocabulary.some((w) => w.id === wordId)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // Free visitors may only record progress for the words they were actually shown
  if (!paid && !approvedWords().slice(0, FREE_WORD_LIMIT).some((w) => w.id === wordId)) {
    return NextResponse.json({ error: "locked" }, { status: 403 });
  }

  const [current] = await db
    .select({ box: vocabProgress.box })
    .from(vocabProgress)
    .where(and(eq(vocabProgress.userId, session.user.id), eq(vocabProgress.wordId, wordId)))
    .limit(1);

  const box = nextBox(current?.box, knew);
  await db
    .insert(vocabProgress)
    .values({ userId: session.user.id, wordId, box })
    .onConflictDoUpdate({
      target: [vocabProgress.userId, vocabProgress.wordId],
      set: { box, updatedAt: new Date() },
    });

  return NextResponse.json({ box });
}
