import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CRUISES } from '../data/cruises';
import { countActiveFilters, filterCruises, parseFilters } from './filters';
import { addDays, formatDateRange } from './format';

const base = parseFilters({});

describe('parseFilters', () => {
  it('returns safe defaults', () => {
    assert.deepEqual(base, {
      q: '',
      river: '',
      month: '',
      duration: 'any',
      maxPrice: null,
      tag: '',
      sort: 'recommended',
    });
  });

  it('rejects malformed values from the URL', () => {
    const f = parseFilters({ month: '2027-13', sort: 'hax', duration: 'forever', maxPrice: 'abc' });
    assert.equal(f.month, '');
    assert.equal(f.sort, 'recommended');
    assert.equal(f.duration, 'any');
    assert.equal(f.maxPrice, null);
  });

  it('clamps price and takes the first value of repeated params', () => {
    assert.equal(parseFilters({ maxPrice: '99999' }).maxPrice, 5000);
    assert.equal(parseFilters({ maxPrice: '10' }).maxPrice, 2000);
    assert.equal(parseFilters({ river: ['Danube', 'Rhine'] }).river, 'Danube');
  });
});

describe('filterCruises', () => {
  it('returns every cruise with no filters', () => {
    assert.equal(filterCruises(CRUISES, base).length, CRUISES.length);
  });

  it('filters by river', () => {
    const r = filterCruises(CRUISES, { ...base, river: 'Danube' });
    assert.equal(r.length, 2);
    assert.ok(r.every((x) => x.cruise.river === 'Danube'));
  });

  it('filters by departure month and only keeps matching departures', () => {
    const r = filterCruises(CRUISES, { ...base, month: '2027-04' });
    assert.ok(r.length > 0);
    for (const x of r) assert.ok(x.departures.every((d) => d.date.startsWith('2027-04')));
  });

  it('applies the price cap per departure and recomputes the "from" price', () => {
    const r = filterCruises(CRUISES, { ...base, maxPrice: 2800 });
    assert.ok(r.length > 0);
    for (const x of r) {
      assert.ok(x.fromPrice <= 2800);
      assert.ok(x.departures.every((d) => d.price <= 2800));
    }
  });

  it('filters by duration', () => {
    assert.ok(filterCruises(CRUISES, { ...base, duration: 'long' }).every((x) => x.cruise.nights >= 8));
    assert.ok(filterCruises(CRUISES, { ...base, duration: 'short' }).every((x) => x.cruise.nights <= 7));
  });

  it('searches across titles, ports and countries', () => {
    assert.ok(filterCruises(CRUISES, { ...base, q: 'vernon' }).some((x) => x.cruise.river === 'Seine'));
    assert.ok(filterCruises(CRUISES, { ...base, q: 'portugal' }).some((x) => x.cruise.river === 'Douro'));
    assert.equal(filterCruises(CRUISES, { ...base, q: 'zzzz' }).length, 0);
  });

  it('sorts by price ascending and descending', () => {
    const asc = filterCruises(CRUISES, { ...base, sort: 'price-asc' }).map((x) => x.fromPrice);
    const desc = filterCruises(CRUISES, { ...base, sort: 'price-desc' }).map((x) => x.fromPrice);
    assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
    assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
  });

  it('shows featured cruises first when recommended', () => {
    const r = filterCruises(CRUISES, base);
    const firstNonFeatured = r.findIndex((x) => !x.cruise.featured);
    assert.ok(r.slice(firstNonFeatured).every((x) => !x.cruise.featured));
  });

  it('combines filters', () => {
    const r = filterCruises(CRUISES, { ...base, river: 'Rhine', month: '2027-04', maxPrice: 3300 });
    assert.ok(r.every((x) => x.cruise.river === 'Rhine'));
  });
});

describe('countActiveFilters', () => {
  it('counts only non-default filters', () => {
    assert.equal(countActiveFilters(base), 0);
    assert.equal(countActiveFilters({ ...base, river: 'Rhine', maxPrice: 3000 }), 2);
    assert.equal(countActiveFilters({ ...base, maxPrice: 5000 }), 0);
  });
});

describe('catalogue integrity', () => {
  it('has unique slugs and one itinerary day per night + 1', () => {
    assert.equal(new Set(CRUISES.map((c) => c.slug)).size, CRUISES.length);
    for (const c of CRUISES) {
      assert.equal(c.itinerary.length, c.nights + 1, `${c.slug} itinerary length`);
      c.itinerary.forEach((d, i) => assert.equal(d.day, i + 1));
      assert.equal(c.itinerary[0].port === c.embark, true, `${c.slug} embark port`);
      assert.ok(c.departures.length > 0);
    }
  });
});

describe('date helpers', () => {
  it('adds days across month boundaries without timezone drift', () => {
    assert.equal(addDays('2027-03-27', 7), '2027-04-03');
    assert.equal(formatDateRange('2027-04-10', 7), 'Apr 10 – Apr 17, 2027');
  });
});
