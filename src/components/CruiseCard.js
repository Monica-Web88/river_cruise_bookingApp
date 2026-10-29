import Link from 'next/link';
import { formatDate, formatPrice, plural } from '@/lib/format';
import RiverScene from './RiverScene';
export default function CruiseCard({ result }) {
  const { cruise, departures, fromPrice } = result;
  const next = departures[0];
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition duration-300 focus-within:ring-2 focus-within:ring-mist-600 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden">
        <RiverScene
          uid={`card-${cruise.slug}`}
          theme={cruise.theme}
          className="aspect-[16/10] w-full transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream-50/90 px-3 py-1 text-xs font-semibold text-bark-800 shadow-soft">
          {cruise.river}
        </span>
        {cruise.featured && (
          <span className="absolute right-4 top-4 rounded-full bg-sand-700 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">
          {plural(cruise.nights, 'night')} ·{' '}
          {cruise.embark === cruise.disembark
            ? `Round trip ${cruise.embark}`
            : `${cruise.embark} to ${cruise.disembark}`}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug">
          <Link
            href={`/cruises/${cruise.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {cruise.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-bark-600">{cruise.tagline}</p>

        <ul className="mb-5 mt-4 flex flex-wrap gap-2" aria-label="Themes">
          {cruise.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-800"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-sand-200 pt-5">
          <div>
            <p className="text-xs text-bark-600">From, per person</p>
            <p className="font-serif text-2xl font-semibold text-bark-900">
              {formatPrice(fromPrice)}
            </p>
          </div>
          <p className="text-right text-xs leading-snug text-bark-600">
            Next sailing
            <br />
            <span className="font-semibold text-bark-800">{formatDate(next.date)}</span>
            {departures.length > 1 && <span className="block">+{departures.length - 1} more</span>}
          </p>
        </div>
      </div>
    </article>
  );
}
