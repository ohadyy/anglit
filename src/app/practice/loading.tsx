// Skeleton for the practice chooser while the question bank is prepared on the server
export default function PracticeLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14" aria-busy="true" aria-label="טוען">
      <div className="animate-pulse">
        <div className="h-5 w-24 rounded-lg bg-fg/10" />
        <div className="mt-3 h-10 w-3/4 rounded-xl bg-fg/10" />
        <div className="mt-8 grid gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-3xl border border-line bg-white p-5 sm:p-6">
              <div className="w-2/5">
                <div className="h-6 w-full rounded-lg bg-fg/10" />
                <div className="mt-2 h-4 w-3/5 rounded-lg bg-fg/10" />
              </div>
              <div className="h-4 w-16 rounded-lg bg-fg/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
