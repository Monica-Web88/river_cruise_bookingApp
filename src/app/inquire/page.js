import InquiryWizard from '@/components/InquiryWizard';
import { getAllCruises } from '@/lib/catalog';
export const metadata = {
  title: 'Request a quote',
  description:
    'Tell us your preferred river cruise, departure and cabin in three short steps and a cruise specialist will send a personalised quote.',
  alternates: { canonical: '/inquire' },
};
const one = (v) => (Array.isArray(v) ? v[0] : v);
export default function InquirePage({ searchParams }) {
  // Only pass the fields the client component needs, keeping the RSC payload small.
  const cruises = getAllCruises().map((c) => ({
    slug: c.slug,
    title: c.title,
    river: c.river,
    nights: c.nights,
    embark: c.embark,
    disembark: c.disembark,
    departures: c.departures,
  }));
  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">Plan your trip</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Request a quote</h1>
        <p className="mt-3 text-lg text-bark-600">
          Three short steps. No payment, no obligation, and a specialist reply within one business
          day.
        </p>
      </header>
      <div className="mt-10">
        <InquiryWizard
          cruises={cruises}
          initial={{
            cruiseSlug: one(searchParams.cruise),
            departure: one(searchParams.departure),
            advisor: one(searchParams.advisor) === '1',
          }}
        />
      </div>
    </div>
  );
}
