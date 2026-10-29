import { CRUISES } from '../data/cruises';
import { formatMonth } from './format';
/**
 * Data-access layer. Every page reads through these functions, so replacing the in-memory
 * catalogue with a CMS / booking API only touches this file.
 */
export const getAllCruises = () => CRUISES;
export const getCruiseBySlug = (slug) => CRUISES.find((c) => c.slug === slug);
export const getFeaturedCruises = () => CRUISES.filter((c) => c.featured);
export function getRivers() {
  const map = new Map();
  for (const c of CRUISES) {
    const entry = map.get(c.river) ?? { name: c.river, count: 0, region: c.region };
    entry.count += 1;
    map.set(c.river, entry);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}
export function getDepartureMonths() {
  const months = new Set();
  for (const c of CRUISES) for (const d of c.departures) months.add(d.date.slice(0, 7));
  return [...months].sort().map((value) => ({ value, label: formatMonth(value) }));
}
export function getTags() {
  const tags = new Set();
  for (const c of CRUISES) for (const t of c.tags) tags.add(t);
  return [...tags].sort();
}
export const getLowestPrice = (cruise) => Math.min(...cruise.departures.map((d) => d.price));
export function getRelatedCruises(cruise, limit = 3) {
  return CRUISES.filter((c) => c.slug !== cruise.slug)
    .map((c) => ({
      c,
      score: Number(c.river === cruise.river) * 2 + Number(c.region === cruise.region),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);
}
