'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { DURATION_OPTIONS, PRICE_MAX, PRICE_MIN, PRICE_STEP, SORT_OPTIONS } from '@/lib/filters';
import { formatPrice } from '@/lib/format';
import { track } from '@/lib/analytics';
/** Keeps filter state in the URL: shareable, back-button friendly and server-rendered. */
function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const update = useCallback(
    (changes) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === '') next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router],
  );
  const reset = useCallback(() => {
    startTransition(() => router.replace(pathname, { scroll: false }));
  }, [pathname, router]);
  return { params, update, reset, pending };
}
function useDebouncedCallback(delay = 300) {
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  return useCallback(
    (fn) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(fn, delay);
    },
    [delay],
  );
}
export function FilterPanel({ rivers, months, tags, activeCount }) {
  const { params, update, reset, pending } = useQueryUpdater();
  const debounce = useDebouncedCallback();
  const [open, setOpen] = useState(false);
  const urlPrice = Number(params.get('maxPrice')) || PRICE_MAX;
  const urlQuery = params.get('q') ?? '';
  const [price, setPrice] = useState(urlPrice);
  const [query, setQuery] = useState(urlQuery);
  // Re-sync local controls when the URL changes (reset, back/forward navigation).
  useEffect(() => setPrice(urlPrice), [urlPrice]);
  useEffect(() => setQuery(urlQuery), [urlQuery]);
  const river = params.get('river') ?? '';
  const month = params.get('month') ?? '';
  const duration = params.get('duration') ?? 'any';
  const tag = params.get('tag') ?? '';
  const change = (key, value) => {
    track('cruise_filter_changed', { filter: key, value: value ?? '' });
    update({ [key]: value });
  };
  return (
    <aside aria-label="Filter cruises" className="lg:sticky lg:top-24 lg:self-start">
      <button
        type="button"
        className="btn btn-secondary w-full justify-between lg:hidden"
        aria-expanded={open}
        aria-controls="filter-form"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Filters{activeCount > 0 ? ` (${activeCount})` : ''}</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <form
        id="filter-form"
        onSubmit={(e) => e.preventDefault()}
        className={`card mt-3 space-y-6 p-6 lg:mt-0 lg:block ${open ? 'block' : 'hidden'}`}
        aria-busy={pending}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Refine</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="rounded text-sm font-medium text-mist-700 underline underline-offset-4"
            >
              Clear all
            </button>
          )}
        </div>

        <div>
          <label htmlFor="f-q" className="label">
            Search
          </label>
          <input
            id="f-q"
            type="search"
            className="field"
            placeholder="Port, country or theme"
            value={query}
            maxLength={80}
            onChange={(e) => {
              setQuery(e.target.value);
              debounce(() => change('q', e.target.value.trim() || null));
            }}
          />
        </div>

        <div>
          <label htmlFor="f-river" className="label">
            River
          </label>
          <select
            id="f-river"
            className="field"
            value={river}
            onChange={(e) => change('river', e.target.value || null)}
          >
            <option value="">All rivers</option>
            {rivers.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name} ({r.count})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-month" className="label">
            Departure month
          </label>
          <select
            id="f-month"
            className="field"
            value={month}
            onChange={(e) => change('month', e.target.value || null)}
          >
            <option value="">Any month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-duration" className="label">
            Duration
          </label>
          <select
            id="f-duration"
            className="field"
            value={duration}
            onChange={(e) => change('duration', e.target.value === 'any' ? null : e.target.value)}
          >
            {DURATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-price" className="label flex items-baseline justify-between">
            <span>Max price per person</span>
            <output htmlFor="f-price" className="font-semibold text-mist-800">
              {price >= PRICE_MAX ? 'Any' : formatPrice(price)}
            </output>
          </label>
          <input
            id="f-price"
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={price}
            className="w-full accent-mist-700"
            onChange={(e) => {
              const value = Number(e.target.value);
              setPrice(value);
              debounce(() => change('maxPrice', value >= PRICE_MAX ? null : String(value)));
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-bark-600" aria-hidden="true">
            <span>{formatPrice(PRICE_MIN)}</span>
            <span>{formatPrice(PRICE_MAX)}+</span>
          </div>
        </div>

        <fieldset>
          <legend className="label">Themes</legend>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className="chip"
                aria-pressed={tag === t}
                onClick={() => change('tag', tag === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>
      </form>
    </aside>
  );
}
export function SortSelect({ value }) {
  const { update, pending } = useQueryUpdater();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-bark-800">
        Sort by
      </label>
      <select
        id="sort"
        className="field !w-auto !py-2"
        value={value}
        aria-busy={pending}
        onChange={(e) => {
          track('cruise_sort_changed', { sort: e.target.value });
          update({ sort: e.target.value === 'recommended' ? null : e.target.value });
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
