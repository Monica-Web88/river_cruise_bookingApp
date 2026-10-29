export const PRICE_MIN = 2000;
export const PRICE_MAX = 5000;
export const PRICE_STEP = 100;
export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'departure', label: 'Earliest departure' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration-asc', label: 'Duration: shortest' },
  { value: 'duration-desc', label: 'Duration: longest' },
];
export const DURATION_OPTIONS = [
  { value: 'any', label: 'Any length' },
  { value: 'short', label: '7 nights or fewer' },
  { value: 'long', label: '8 nights or more' },
];
const first = (value) => (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
const isSort = (v) => SORT_OPTIONS.some((o) => o.value === v);
const isDuration = (v) => DURATION_OPTIONS.some((o) => o.value === v);
/** Turns untrusted URL search params into a safe, fully-typed filter object. */
export function parseFilters(params) {
  const month = first(params.month);
  const price = Number(first(params.maxPrice));
  const sort = first(params.sort);
  const duration = first(params.duration);
  return {
    q: first(params.q).slice(0, 80),
    river: first(params.river),
    month: /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : '',
    duration: isDuration(duration) ? duration : 'any',
    maxPrice:
      Number.isFinite(price) && price > 0
        ? Math.min(Math.max(Math.round(price), PRICE_MIN), PRICE_MAX)
        : null,
    tag: first(params.tag),
    sort: isSort(sort) ? sort : 'recommended',
  };
}
export function countActiveFilters(f) {
  return [
    f.q,
    f.river,
    f.month,
    f.duration !== 'any' ? f.duration : '',
    f.maxPrice !== null && f.maxPrice < PRICE_MAX ? 'price' : '',
    f.tag,
  ].filter(Boolean).length;
}
const matchesText = (cruise, q) => {
  if (!q) return true;
  const haystack = [
    cruise.title,
    cruise.river,
    cruise.embark,
    cruise.disembark,
    cruise.summary,
    ...cruise.countries,
    ...cruise.tags,
    ...cruise.itinerary.map((d) => d.port),
  ]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};
export function filterCruises(cruises, filters) {
  const results = [];
  for (const cruise of cruises) {
    if (filters.river && cruise.river !== filters.river) continue;
    if (filters.tag && !cruise.tags.includes(filters.tag)) continue;
    if (filters.duration === 'short' && cruise.nights > 7) continue;
    if (filters.duration === 'long' && cruise.nights < 8) continue;
    if (!matchesText(cruise, filters.q)) continue;
    // Month and price are evaluated per departure so "from" prices always reflect the filter.
    const departures = cruise.departures
      .filter((d) => !filters.month || d.date.startsWith(filters.month))
      .filter((d) => filters.maxPrice === null || d.price <= filters.maxPrice)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (departures.length === 0) continue;
    results.push({
      cruise,
      departures,
      fromPrice: Math.min(...departures.map((d) => d.price)),
    });
  }
  return sortResults(results, filters.sort);
}
export function sortResults(results, sort) {
  const copy = [...results];
  switch (sort) {
    case 'departure':
      return copy.sort((a, b) => a.departures[0].date.localeCompare(b.departures[0].date));
    case 'price-asc':
      return copy.sort((a, b) => a.fromPrice - b.fromPrice);
    case 'price-desc':
      return copy.sort((a, b) => b.fromPrice - a.fromPrice);
    case 'duration-asc':
      return copy.sort((a, b) => a.cruise.nights - b.cruise.nights);
    case 'duration-desc':
      return copy.sort((a, b) => b.cruise.nights - a.cruise.nights);
    case 'recommended':
    default:
      // Featured voyages first; Array.prototype.sort is stable so catalogue order is preserved.
      return copy.sort((a, b) => Number(!!b.cruise.featured) - Number(!!a.cruise.featured));
  }
}
