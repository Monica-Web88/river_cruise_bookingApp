import Link from 'next/link';
import { Suspense } from 'react';
import CruiseCard from '@/components/CruiseCard';
import { FilterPanel, SortSelect } from '@/components/CruiseFilters';
import { getAllCruises, getDepartureMonths, getRivers, getTags } from '@/lib/catalog';
import { countActiveFilters, filterCruises, parseFilters } from '@/lib/filters';
import { formatMonth } from '@/lib/format';
export const metadata = {
  title: 'Find a river cruise',
  description:
    'Filter river cruises by river, departure month, price and duration. Compare itineraries on the Danube, Rhine, Seine, Douro, Rhône and Mekong.',
  alternates: { canonical: '/cruises' },
};
// Rendered on the server for every request (search params make this a dynamic route),
// so results are crawlable, shareable and correct on first paint with zero client-side fetching.
export default function CruisesPage({ searchParams }) {
  const filters = parseFilters(searchParams);
  const all = getAllCruises();
  const results = filterCruises(all, filters);
  const activeCount = countActiveFilters(filters);
  const summary = [
    filters.river && `on the ${filters.river}`,
    filters.month && `departing ${formatMonth(filters.month)}`,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Find your voyage</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">River cruises</h1>
        <p className="mt-3 text-lg text-bark-600">
          Narrow {all.length} voyages by river, month, price and length, then open any itinerary for
          a day-by-day plan.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[18rem_1fr]">
        <Suspense fallback={<div className="card h-96 animate-pulse" aria-hidden="true" />}>
          <FilterPanel
            rivers={getRivers()}
            months={getDepartureMonths()}
            tags={getTags()}
            activeCount={activeCount}
          />
        </Suspense>

        <section aria-label="Search results">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="text-sm text-bark-600">
              Showing <strong className="text-bark-900">{results.length}</strong> of {all.length}{' '}
              cruises
              {summary && ` ${summary}`}
            </p>
            <Suspense fallback={null}>
              <SortSelect value={filters.sort} />
            </Suspense>
          </div>

          {results.length > 0 ? (
            <ul className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <li key={result.cruise.slug}>
                  <CruiseCard result={result} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="card flex flex-col items-center px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold">No cruises match those filters</h2>
              <p className="mt-2 max-w-md text-bark-600">
                Try a different month, raise your price limit, or clear the filters to see every
                voyage.
              </p>
              <Link href="/cruises" className="btn btn-primary mt-6">
                Clear all filters
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
