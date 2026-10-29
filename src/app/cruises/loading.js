export default function Loading() {
  return (
    <div className="container-page py-14" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading cruises…</span>
      <div className="h-10 w-72 animate-pulse rounded-xl bg-sand-100" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <div className="card h-96 animate-pulse" />
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-96 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
