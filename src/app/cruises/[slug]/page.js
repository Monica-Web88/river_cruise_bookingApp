import Link from 'next/link';
import { notFound } from 'next/navigation';
import CruiseCard from '@/components/CruiseCard';
import RiverScene from '@/components/RiverScene';
import { getAllCruises, getCruiseBySlug, getLowestPrice, getRelatedCruises } from '@/lib/catalog';
import { formatDate, formatDateRange, formatPrice, plural } from '@/lib/format';
// Static generation + Incremental Static Regeneration:
// every itinerary is pre-rendered at build time and refreshed in the background hourly,
// so pricing/availability edits go live without a redeploy.
export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllCruises().map((c) => ({ slug: c.slug }));
}
export function generateMetadata({ params }) {
  const cruise = getCruiseBySlug(params.slug);
  if (!cruise) return {};
  const title = `${cruise.title}: ${cruise.nights}-night ${cruise.river} cruise`;
  return {
    title,
    description: cruise.summary,
    alternates: { canonical: `/cruises/${cruise.slug}` },
    openGraph: { title, description: cruise.summary, type: 'article' },
  };
}
export default function CruiseDetailPage({ params }) {
  const cruise = getCruiseBySlug(params.slug);
  if (!cruise) notFound();
  const lowest = getLowestPrice(cruise);
  const related = getRelatedCruises(cruise).map((c) => ({
    cruise: c,
    departures: c.departures,
    fromPrice: getLowestPrice(c),
  }));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  // Structured data for rich results. "<" is escaped so the JSON can never close the script tag.
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: cruise.title,
    description: cruise.summary,
    touristType: cruise.tags,
    url: `${siteUrl}/cruises/${cruise.slug}`,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: cruise.itinerary.map((d) => ({
        '@type': 'ListItem',
        position: d.day,
        item: { '@type': 'City', name: d.port, description: d.description },
      })),
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: lowest,
      highPrice: Math.max(...cruise.departures.map((d) => d.price)),
      offerCount: cruise.departures.length,
    },
  }).replace(/</g, '\\u003c');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <div className="container-page pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-bark-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="rounded hover:text-mist-700">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/cruises" className="rounded hover:text-mist-700">
                Cruises
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-bark-900">
              {cruise.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* HERO */}
      <section className="container-page pt-6">
        <div className="relative overflow-hidden rounded-4xl border border-sand-200 shadow-lift">
          <RiverScene
            uid={`hero-${cruise.slug}`}
            theme={cruise.theme}
            className="h-72 w-full sm:h-96"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bark-900/70 to-transparent px-6 pb-6 pt-24 sm:px-10 sm:pb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream-100">
              {cruise.river} · {plural(cruise.nights, 'night')}
            </p>
            <h1 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-tight text-white sm:text-5xl">
              {cruise.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <p className="text-xl leading-relaxed text-bark-800">{cruise.tagline}</p>
          <p className="mt-4 leading-relaxed text-bark-600">{cruise.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              [
                'Route',
                cruise.embark === cruise.disembark
                  ? `${cruise.embark} round trip`
                  : `${cruise.embark} → ${cruise.disembark}`,
              ],
              ['Length', plural(cruise.nights, 'night')],
              ['Ship', cruise.ship],
              ['Countries', cruise.countries.join(', ')],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-sand-200 bg-cream-50 p-4">
                <dt className="text-xs font-semibold uppercase tracking-widest text-sand-700">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-bark-900">{value}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="highlights-heading" className="mt-12">
            <h2 id="highlights-heading" className="text-2xl font-semibold sm:text-3xl">
              Voyage highlights
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {cruise.highlights.map((h) => (
                <li
                  key={h}
                  className="flex gap-3 rounded-2xl bg-mist-50 p-4 text-sm leading-relaxed"
                >
                  <span aria-hidden="true" className="mt-0.5 text-mist-700">
                    ✦
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="itinerary-heading" className="mt-14">
            <h2 id="itinerary-heading" className="text-2xl font-semibold sm:text-3xl">
              Day-by-day itinerary
            </h2>
            <ol className="mt-8">
              {cruise.itinerary.map((d, i) => (
                <li key={d.day} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < cruise.itinerary.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[1.15rem] top-10 h-[calc(100%-2.25rem)] w-px bg-sand-300"
                    />
                  )}
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-300 bg-cream-50 font-serif text-sm font-semibold text-mist-800">
                    <span className="sr-only">Day </span>
                    {d.day}
                  </span>
                  <div className="card flex-1 p-5">
                    <p className="eyebrow">{d.port}</p>
                    <h3 className="mt-1 text-lg font-semibold">{d.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-bark-600">{d.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="included-heading" className="mt-14">
            <h2 id="included-heading" className="text-2xl font-semibold sm:text-3xl">
              What’s included
            </h2>
            <ul className="mt-5 space-y-3">
              {cruise.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-bark-800">
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-1 h-4 w-4 shrink-0 text-mist-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="departures-heading" className="mt-14">
            <h2 id="departures-heading" className="text-2xl font-semibold sm:text-3xl">
              Departure dates & prices
            </h2>
            <div className="card mt-6 overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left text-sm">
                <caption className="sr-only">
                  Available departures for {cruise.title} with price per person
                </caption>
                <thead className="border-b border-sand-200 text-xs uppercase tracking-widest text-sand-700">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      Sailing
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold">
                      From, per person
                    </th>
                    <th scope="col" className="px-5 py-4 text-right font-semibold">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cruise.departures.map((d) => (
                    <tr key={d.date} className="border-b border-sand-200 last:border-0">
                      <th scope="row" className="px-5 py-4 font-medium text-bark-900">
                        {formatDateRange(d.date, cruise.nights)}
                      </th>
                      <td className="px-5 py-4 font-serif text-lg font-semibold">
                        {formatPrice(d.price)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/inquire?cruise=${cruise.slug}&departure=${d.date}`}
                          className="btn btn-secondary !px-4 !py-2"
                        >
                          Request quote
                          <span className="sr-only"> for {formatDate(d.date)}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-bark-600">
              Prices are per person, double occupancy, in a Deluxe Stateroom. Upgrade categories are
              priced in the quote.
            </p>
          </section>
        </div>

        {/* STICKY BOOKING CARD */}
        <aside aria-label="Plan this voyage" className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-xs text-bark-600">From, per person</p>
            <p className="font-serif text-4xl font-semibold text-bark-900">{formatPrice(lowest)}</p>
            <p className="mt-1 text-sm text-bark-600">
              {plural(cruise.departures.length, 'departure')} · {plural(cruise.nights, 'night')}
            </p>
            <Link href={`/inquire?cruise=${cruise.slug}`} className="btn btn-primary mt-6 w-full">
              Request a quote
            </Link>
            <Link href="/cruises" className="btn btn-secondary mt-3 w-full">
              Compare other cruises
            </Link>
            <ul className="mt-6 space-y-2 border-t border-sand-200 pt-5 text-sm text-bark-600">
              <li>No payment required to enquire</li>
              <li>Reply from a cruise specialist within one business day</li>
              <li>Flexible changes before final payment</li>
            </ul>
          </div>
        </aside>
      </div>

      <section aria-labelledby="related-heading" className="container-page pb-6">
        <h2 id="related-heading" className="text-2xl font-semibold sm:text-3xl">
          You might also like
        </h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {related.map((result) => (
            <li key={result.cruise.slug}>
              <CruiseCard result={result} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
