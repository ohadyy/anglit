import { ResultsDeck } from "@/components/ResultsDeck";
import { results, resultsCopy } from "@/content/results";

// Before -> after cards for real students, first letter only, as a draggable stack
export function ResultsCards() {
  const gains = results.map((r) => r.after - r.before);
  const avg = Math.round(gains.reduce((a, b) => a + b, 0) / gains.length);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-balance sm:text-3xl">{resultsCopy.title}</h2>
        <p className="mt-3 opacity-70">{resultsCopy.sub}</p>

        <div className="mt-8">
          <ResultsDeck cards={results} />
        </div>

        {results.length >= resultsCopy.minForAverage && (
          <p className="mt-6 font-semibold">{resultsCopy.averageLabel(avg)}</p>
        )}
      </div>
    </section>
  );
}
