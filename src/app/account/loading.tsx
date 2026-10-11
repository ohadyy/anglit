// Skeleton that mirrors the account page: the same container, header, tile grid and sign-out button,
// so the layout does not jump when the real content arrives.
export default function AccountLoading() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-12 sm:px-6" aria-busy="true" aria-label="טוען">
      <header className="animate-pulse">
        <div className="h-11 w-2/3 rounded-xl bg-fg/10 sm:h-15" />
        <div className="mt-3 h-7 w-1/2 rounded-lg bg-fg/10" />
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex min-h-44 animate-pulse flex-col justify-between rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]"
          >
            <div>
              <span className="block size-2.5 rounded-full bg-fg/10" />
              <div className="mt-6 h-8 w-1/2 rounded-lg bg-fg/10" />
              <div className="mt-2 h-4 w-full rounded-lg bg-fg/10" />
              <div className="mt-2 h-4 w-4/5 rounded-lg bg-fg/10" />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="h-4 w-16 rounded-lg bg-fg/10" />
              <span className="size-5 rounded-full bg-fg/10" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 h-12 w-28 animate-pulse self-start rounded-full bg-fg/10" aria-hidden />
    </div>
  );
}
