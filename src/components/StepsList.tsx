// Numbered step list used by both the homepage and the sprint landing page
export function StepsList({ steps }: { steps: { step: string; text: string }[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {steps.map((item, i) => (
        <li key={item.step} className="flex gap-4 py-6">
          <span className="text-3xl font-bold tabular-nums opacity-30">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <span className="font-bold leading-snug">{item.step}</span>
            <p className="mt-1 leading-relaxed opacity-80">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
