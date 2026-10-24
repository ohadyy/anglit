import type { Metadata } from "next";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { approvedWords, buildSession, FREE_WORD_LIMIT, MAX_BOX } from "@/lib/vocab";
import { vocabCategories, vocabCopy, vocabTiers, type VocabCategory, type VocabTier } from "@/content/vocabulary";
import { db } from "@/db";
import { vocabProgress } from "@/db/schema";
import { VocabClient } from "./VocabClient";
import { VocabFilters } from "./VocabPicker";

export const metadata: Metadata = {
  title: vocabCopy.title,
  robots: { index: false },
};

export default async function VocabularyPage({ searchParams }: PageProps<"/vocabulary">) {
  const params = await searchParams;
  const tier = vocabTiers.find((t) => t.id === params.tier)?.id;
  const category = vocabCategories.find((c) => c.id === params.category)?.id;

  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;

  const rows = session
    ? await db
        .select({ wordId: vocabProgress.wordId, box: vocabProgress.box })
        .from(vocabProgress)
        .where(eq(vocabProgress.userId, session.user.id))
    : [];
  const boxes = new Map(rows.map((r) => [r.wordId, r.box]));

  // Free visitors only draw from the first words of the bank; the rest stays behind payment
  const pool = paid ? approvedWords() : approvedWords().slice(0, FREE_WORD_LIMIT);

  const inTier = tier ? pool.filter((w) => w.tier === tier) : pool;
  const tierCounts = Object.fromEntries(
    vocabTiers.map((t) => [t.id, pool.filter((w) => w.tier === t.id && (!category || w.category === category)).length])
  ) as Record<VocabTier, number>;
  const categoryCounts = Object.fromEntries(
    vocabCategories.map((c) => [c.id, inTier.filter((w) => w.category === c.id).length])
  ) as Record<VocabCategory, number>;
  const words = category ? inTier.filter((w) => w.category === category) : inTier;
  const round = buildSession(boxes, words);
  const known = words.filter((w) => boxes.get(w.id) === MAX_BOX).length;

  return (
    <VocabClient
      key={`${tier ?? "all"}-${category ?? "all"}`}
      words={round}
      total={words.length}
      known={known}
      paid={paid}
      header={<VocabFilters tier={tier} category={category} tierCounts={tierCounts} categoryCounts={categoryCounts} />}
    />
  );
}
