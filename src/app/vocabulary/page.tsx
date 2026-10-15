import type { Metadata } from "next";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { approvedWords, buildSession, FREE_WORD_LIMIT, MAX_BOX } from "@/lib/vocab";
import { vocabCopy } from "@/content/vocabulary";
import { db } from "@/db";
import { vocabProgress } from "@/db/schema";
import { VocabClient } from "./VocabClient";

export const metadata: Metadata = {
  title: vocabCopy.title,
  robots: { index: false },
};

export default async function VocabularyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;

  const rows = session
    ? await db
        .select({ wordId: vocabProgress.wordId, box: vocabProgress.box })
        .from(vocabProgress)
        .where(eq(vocabProgress.userId, session.user.id))
    : [];
  const boxes = new Map(rows.map((r) => [r.wordId, r.box]));

  // Free visitors only draw their round from the first words of the bank; the rest stays behind payment
  const words = paid ? approvedWords() : approvedWords().slice(0, FREE_WORD_LIMIT);
  const round = buildSession(boxes, words);
  const known = words.filter((w) => boxes.get(w.id) === MAX_BOX).length;

  return <VocabClient words={round} total={words.length} known={known} paid={paid} />;
}
