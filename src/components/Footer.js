import Link from 'next/link';
import { getRivers } from '@/lib/catalog';
import Logo from './Logo';
export default function Footer() {
  const rivers = getRivers();
  return (
    <footer className="mt-24 border-t border-sand-200 bg-cream-200/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bark-600">
            Small-ship river voyages designed for curious travelers: unhurried itineraries, regional
            food and wine, and a guided experience in every port.
          </p>
        </div>

        <nav aria-label="Rivers">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-sand-700">Rivers</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {rivers.map((r) => (
              <li key={r.name}>
                <Link
                  className="rounded text-bark-800 hover:text-mist-700"
                  href={`/cruises?river=${encodeURIComponent(r.name)}`}
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-sand-700">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="rounded text-bark-800 hover:text-mist-700" href="/cruises">
                All cruises
              </Link>
            </li>
            <li>
              <Link className="rounded text-bark-800 hover:text-mist-700" href="/inquire">
                Request a quote
              </Link>
            </li>
            <li>
              <Link className="rounded text-bark-800 hover:text-mist-700" href="/inquire?advisor=1">
                Travel advisors
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-sand-200">
        <p className="container-page py-5 text-xs leading-relaxed text-bark-600">
          Alderwater River Cruises is a fictional brand created for a front-end engineering
          portfolio project. Itineraries, ships and prices are sample content; no bookings are
          taken.
        </p>
      </div>
    </footer>
  );
}
