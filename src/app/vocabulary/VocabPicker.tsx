import Link from "next/link";
import {
  vocabCategories,
  vocabCopy,
  vocabTiers,
  type VocabCategory,
  type VocabTier,
} from "@/content/vocabulary";

type Chip = { key: string; label: string; href: string | null; count: number; active: boolean };

function Chips({ title, chips }: { title: string; chips: Chip[] }) {
  return (
    <div className="mt-4">
      <p className="text-base font-semibold">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {chips.map((c) => (
          <li key={c.key}>
            {!c.href ? (
              <span className="inline-flex min-h-12 items-center gap-2 border border-line px-4 text-base opacity-40">
                {c.label}
                {c.count === 0 && <span className="text-sm">{vocabCopy.lockedTier}</span>}
              </span>
            ) : (
              <Link
                href={c.href}
                aria-current={c.active ? "true" : undefined}
                className={`inline-flex min-h-12 items-center gap-2 border px-4 text-base font-semibold ${
                  c.active ? "border-fg bg-fg text-bg" : "border-fg/25 hover:bg-fg/5"
                }`}
              >
                {c.label}
                <bdi dir="ltr" className="tabular-nums opacity-70">
                  {c.count}
                </bdi>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Two rows of links (work on any phone, no script). Both default to "all".
// Tier counts ignore the category and category counts follow the chosen tier.
export function VocabFilters({
  tier,
  category,
  tierCounts,
  categoryCounts,
}: {
  tier: VocabTier | undefined;
  category: VocabCategory | undefined;
  tierCounts: Record<VocabTier, number>;
  categoryCounts: Record<VocabCategory, number>;
}) {
  const href = (t?: VocabTier, c?: VocabCategory) => {
    const q = new URLSearchParams();
    if (t) q.set("tier", t);
    if (c) q.set("category", c);
    const s = q.toString();
    return s ? `/vocabulary?${s}` : "/vocabulary";
  };
  const tierLabel = vocabTiers.find((t) => t.id === tier)?.label ?? vocabCopy.allTiers;
  const categoryLabel = vocabCategories.find((c) => c.id === category)?.label ?? vocabCopy.allCategories;
  const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

  const tierChips: Chip[] = [
    { key: "all", label: vocabCopy.allTiers, href: href(undefined, category), count: sum(tierCounts), active: !tier },
    ...vocabTiers.map((t) => ({
      key: t.id,
      label: t.label,
      href: tierCounts[t.id] ? href(t.id, category) : null,
      count: tierCounts[t.id],
      active: tier === t.id,
    })),
  ];
  const categoryChips: Chip[] = [
    { key: "all", label: vocabCopy.allCategories, href: href(tier), count: sum(categoryCounts), active: !category },
    ...vocabCategories.map((c) => ({
      key: c.id,
      label: c.label,
      href: categoryCounts[c.id] ? href(tier, c.id) : null,
      count: categoryCounts[c.id],
      active: category === c.id,
    })),
  ];

  return (
    // Collapsed by default so the word card stays near the top of a phone screen
    <details className="group mt-6 border border-line bg-white">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
        <span>
          {vocabCopy.filterLabel}: {tierLabel} · {categoryLabel}
        </span>
        <span aria-hidden className="text-xl transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="px-4 pb-5">
        <Chips title={vocabCopy.pickTier} chips={tierChips} />
        <Chips title={vocabCopy.pickCategory} chips={categoryChips} />
      </div>
    </details>
  );
}
