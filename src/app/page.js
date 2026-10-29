import Link from 'next/link';
import CruiseCard from '@/components/CruiseCard';
import RiverScene from '@/components/RiverScene';
import {
  getAllCruises,
  getDepartureMonths,
  getFeaturedCruises,
  getLowestPrice,
  getRivers,
} from '@/lib/catalog';
import { filterCruises, parseFilters } from '@/lib/filters';
import { formatPrice } from '@/lib/format';
// Fully static: the home page is built once and served from the CDN.
export default function HomePage() {
  const rivers = getRivers();
  const months = getDepartureMonths();
  const featured = filterCruises(getFeaturedCruises(), parseFilters({}));
  const cruiseCount = getAllCruises().length;
  const lowest = Math.min(...getAllCruises().map(getLowestPrice));
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-mist-200/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sand-200/70 blur-3xl"
        />

        <div className="container-page relative grid items-center gap-12 pb-20 pt-12 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          <div className="animate-fade-up">
            <p className="eyebrow">Boutique river cruising</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
              Slow down on the water.
              <span className="block text-mist-700">Wake up somewhere extraordinary.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark-600">
              Small-ship voyages along the Danube, Rhine, Seine, Douro, Rhône and Mekong, with
              regional wine at dinner and a guided experience in every port.
            </p>

            {/* Search: plain GET form, works before JavaScript loads */}
            <form
              action="/cruises"
              method="get"
              className="card mt-9 grid gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-5"
              aria-label="Find a river cruise"
            >
              <div>
                <label htmlFor="hero-river" className="label">
                  River
                </label>
                <select id="hero-river" name="river" className="field" defaultValue="">
                  <option value="">Any river</option>
                  {rivers.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name} ({r.count})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hero-month" className="label">
                  Departing
                </label>
                <select id="hero-month" name="month" className="field" defaultValue="">
                  <option value="">Any month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Find cruises
              </button>
            </form>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-bark-600">Voyages</dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-bark-900">
                  {cruiseCount}
                </dd>
              </div>
              <div>
                <dt className="text-bark-600">Rivers</dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-bark-900">
                  {rivers.length}
                </dd>
              </div>
              <div>
                <dt className="text-bark-600">From</dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-bark-900">
                  {formatPrice(lowest)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="overflow-hidden rounded-4xl border border-sand-200 shadow-lift">
              <RiverScene uid="hero" theme="dawn" className="aspect-[4/3.6] w-full" />
            </div>
            <div className="absolute -bottom-6 left-4 max-w-[15rem] animate-drift rounded-2xl border border-sand-200 bg-cream-50 p-4 shadow-lift sm:left-[-1.5rem]">
              <p className="eyebrow">Featured · 7 nights</p>
              <p className="mt-1 font-serif text-lg font-semibold leading-snug">
                Budapest to Passau
              </p>
              <p className="mt-1 text-xs text-bark-600">Imperial capitals of the Danube</p>
            </div>
           {/* <div className="absolute -right-2 top-6 hidden rounded-2xl border border-sand-200 bg-cream-50/95 px-4 py-3 shadow-lift sm:block">
              <p className="text-xs text-bark-600">Wine with dinner</p>
              <p className="font-serif text-base font-semibold">Always included</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section aria-labelledby="featured-heading" className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Handpicked for you</p>
            <h2 id="featured-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
              Featured voyages
            </h2>
          </div>
          <Link href="/cruises" className="btn btn-secondary">
            View all {cruiseCount} cruises
          </Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((result) => (
            <CruiseCard key={result.cruise.slug} result={result} />
          ))}
        </div>
      </section>

      {/* RIVERS */}
      <section id="rivers" aria-labelledby="rivers-heading" className="bg-mist-50 py-20">
        <div className="container-page">
          <p className="eyebrow">Explore by destination</p>
          <h2 id="rivers-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
            Choose your river
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rivers.map((river, i) => {
              const themes = ['dawn', 'day', 'dusk', 'mist'];
              return (
                <li key={river.name}>
                  <Link
                    href={`/cruises?river=${encodeURIComponent(river.name)}`}
                    className="card group flex items-center gap-5 p-4 transition hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <RiverScene
                      uid={`river-${river.name}`}
                      theme={themes[i % themes.length]}
                      className="h-20 w-24 shrink-0 rounded-2xl"
                    />
                    <span>
                      <span className="block font-serif text-xl font-semibold text-bark-900">
                        {river.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-bark-600">
                        {river.region} · {river.count} {river.count === 1 ? 'voyage' : 'voyages'}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto pr-2 text-xl text-sand-600 transition group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" aria-labelledby="how-heading" className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple from start to sail</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
            Plan your voyage in three steps
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Explore & filter',
              text: 'Search by river, month, price and length. Every itinerary shows each port, day by day.',
            },
            {
              title: 'Request a quote',
              text: 'Tell us your dates, cabin and travelers in a short three-step form. No payment needed.',
            },
            {
              title: 'Talk to an advisor',
              text: 'A cruise specialist confirms availability and tailors flights, pre-stays and excursions.',
            },
          ].map((step, i) => (
            <li key={step.title} className="card p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist-100 font-serif text-lg font-semibold text-mist-800">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-bark-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WHY */}
      <section aria-labelledby="why-heading" className="container-page pb-6">
        <div className="grid gap-12 rounded-4xl bg-cream-200/70 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">The Dream River Cruise difference</p>
            <h2 id="why-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
              Thoughtfully inclusive, quietly luxurious
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-bark-600">
              Fewer than 150 guests per ship means short queues, personal service and docks in the
              middle of town, so you step off the gangway and you’re already there.
            </p>
            <Link href="/inquire" className="btn btn-brown mt-8">
              Start planning
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              ['Regional wine with dinner', 'Poured generously, always local.'],
              ['A guided tour in every port', 'Included, with small groups and headsets.'],
              ['Docked downtown', 'Most ports are a short stroll from the old town.'],
              ['Open-seating dining', 'Menus shaped by the markets of the day.'],
            ].map(([title, text]) => (
              <li key={title} className="rounded-2xl border border-sand-200 bg-cream-50 p-5">
                <p className="font-serif text-lg font-semibold text-bark-900">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-bark-600">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-heading" className="container-page py-16">
        <div className="relative overflow-hidden rounded-4xl bg-mist-700 px-8 py-14 text-center sm:px-16">
          <div aria-hidden="true" className="absolute inset-0 opacity-20">
            <RiverScene uid="cta" theme="mist" className="h-full w-full" />
          </div>
          <div className="relative">
            <h2
              id="cta-heading"
              className="font-serif text-3xl font-semibold text-white sm:text-4xl"
            >
              Not sure where to begin?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-mist-100">
              Share a few details and we’ll reply with a personalised quote and itinerary ideas.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/inquire" className="btn bg-cream-50 text-bark-900 hover:bg-white">
                Request a quote
              </Link>
              <Link
                href="/cruises"
                className="btn border border-white/50 text-white hover:bg-white/10"
              >
                Browse cruises
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
