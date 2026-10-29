'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CABINS } from '@/data/cabins';
import { track } from '@/lib/analytics';
import { formatDateRange, formatPrice, plural } from '@/lib/format';
import { collectErrors, contactSchema, tripSchema } from '@/lib/inquiry';
const STEPS = ['Your voyage', 'About you', 'Review'];
const STEP_FIELDS = {
  0: ['cruiseSlug', 'departure', 'travelers', 'cabin'],
  1: ['firstName', 'lastName', 'email', 'phone', 'contactMethod', 'notes'],
};
export default function InquiryWizard({ cruises, initial }) {
  const startCruise = cruises.find((c) => c.slug === initial.cruiseSlug);
  const startDeparture = startCruise?.departures.find((d) => d.date === initial.departure)?.date;
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');
  const [reference, setReference] = useState('');
  const [form, setForm] = useState({
    cruiseSlug: startCruise?.slug ?? '',
    departure: startDeparture ?? startCruise?.departures[0]?.date ?? '',
    travelers: 2,
    cabin: 'french',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contactMethod: 'email',
    notes: '',
    isAdvisor: Boolean(initial.advisor),
    newsletter: true,
    website: '',
  });
  const headingRef = useRef(null);
  const mounted = useRef(false);
  const cruise = useMemo(
    () => cruises.find((c) => c.slug === form.cruiseSlug),
    [cruises, form.cruiseSlug],
  );
  const departure = cruise?.departures.find((d) => d.date === form.departure);
  const cabin = CABINS.find((c) => c.id === form.cabin);
  const estimate =
    departure && cabin ? Math.round(departure.price * cabin.multiplier * form.travelers) : null;
  // Move focus to the step heading so screen-reader and keyboard users land in the right place.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      track('inquiry_started', { cruise: form.cruiseSlug || 'none' });
      return;
    }
    headingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, status]);
  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const onCruiseChange = (slug) => {
    const next = cruises.find((c) => c.slug === slug);
    setForm((prev) => ({ ...prev, cruiseSlug: slug, departure: next?.departures[0]?.date ?? '' }));
    setErrors((prev) => ({ ...prev, cruiseSlug: undefined, departure: undefined }));
  };
  const validateStep = (index) => {
    if (index === 0) {
      const result = tripSchema.safeParse({
        cruiseSlug: form.cruiseSlug,
        departure: form.departure,
        travelers: form.travelers,
        cabin: form.cabin,
      });
      setErrors(result.success ? {} : collectErrors(result.error));
      return result.success;
    }
    if (index === 1) {
      const result = contactSchema.safeParse({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        contactMethod: form.contactMethod,
        notes: form.notes,
        isAdvisor: form.isAdvisor,
        newsletter: form.newsletter,
        website: form.website,
      });
      setErrors(result.success ? {} : collectErrors(result.error));
      return result.success;
    }
    return true;
  };
  const goNext = () => {
    if (!validateStep(step)) {
      track('inquiry_step_error', { step: step + 1 });
      return;
    }
    track('inquiry_step_completed', { step: step + 1 });
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };
  const submit = async (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      goNext();
      return;
    }
    if (!validateStep(0) || !validateStep(1)) return;
    setStatus('submitting');
    setServerMessage('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.reference) {
        setReference(data.reference);
        setStatus('success');
        track('inquiry_submitted', {
          cruise: form.cruiseSlug,
          travelers: form.travelers,
          cabin: form.cabin,
        });
        return;
      }
      if (res.status === 422 && data.fieldErrors) {
        setErrors(data.fieldErrors);
        const firstStep = Object.keys(data.fieldErrors).some((k) => STEP_FIELDS[0].includes(k))
          ? 0
          : 1;
        setStep(firstStep);
      }
      setServerMessage(data.message ?? 'Something went wrong. Please try again.');
      setStatus('error');
      track('inquiry_failed', { status: res.status });
    } catch {
      setServerMessage('We couldn’t reach the server. Check your connection and try again.');
      setStatus('error');
      track('inquiry_failed', { status: 0 });
    }
  };
  const err = (name) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });
  const fieldError = (name) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-red-800">
        {errors[name]}
      </p>
    ) : null;
  /* ---------- SUCCESS ---------- */
  if (status === 'success') {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist-100 text-mist-800">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-3xl font-semibold outline-none">
          Thank you, {form.firstName}
        </h2>
        <p className="mt-3 text-bark-600">
          Your enquiry is in. A cruise specialist will reply to{' '}
          <strong className="text-bark-900">
            {form.contactMethod === 'phone' ? form.phone : form.email}
          </strong>{' '}
          within one business day.
        </p>
        <p className="mt-6 inline-block rounded-full bg-sand-100 px-5 py-2 text-sm">
          Reference: <strong className="font-mono tracking-wider">{reference}</strong>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/cruises" className="btn btn-primary">
            Keep browsing
          </Link>
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }
  /* ---------- WIZARD ---------- */
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="card p-6 sm:p-9">
        <nav aria-label="Progress">
          <ol className="flex items-center gap-3">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className="flex flex-1 items-center gap-3"
                aria-current={i === step ? 'step' : undefined}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${i <= step ? 'bg-mist-700 text-white' : 'bg-sand-100 text-bark-600'}`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span
                  className={`hidden text-sm sm:block ${i === step ? 'font-semibold text-bark-900' : 'text-bark-600'}`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="h-px flex-1 bg-sand-300" />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-bark-600 sm:hidden">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </nav>

        <form onSubmit={submit} noValidate className="mt-8">
          {serverMessage && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-900"
            >
              {serverMessage}
            </div>
          )}

          {step === 0 && (
            <fieldset className="space-y-6">
              <legend className="sr-only">Your voyage</legend>
              <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
                Choose your voyage
              </h2>

              <div>
                <label htmlFor="cruiseSlug" className="label">
                  Cruise
                </label>
                <select
                  id="cruiseSlug"
                  className="field"
                  value={form.cruiseSlug}
                  onChange={(e) => onCruiseChange(e.target.value)}
                  {...err('cruiseSlug')}
                >
                  <option value="">Select a cruise</option>
                  {cruises.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title} ({c.river}, {c.nights} nights)
                    </option>
                  ))}
                </select>
                {fieldError('cruiseSlug')}
              </div>

              <div>
                <label htmlFor="departure" className="label">
                  Departure
                </label>
                <select
                  id="departure"
                  className="field"
                  value={form.departure}
                  onChange={(e) => set('departure', e.target.value)}
                  disabled={!cruise}
                  {...err('departure')}
                >
                  {!cruise && <option value="">Choose a cruise first</option>}
                  {cruise?.departures.map((d) => (
                    <option key={d.date} value={d.date}>
                      {formatDateRange(d.date, cruise.nights)} · from {formatPrice(d.price)}
                    </option>
                  ))}
                </select>
                {fieldError('departure')}
              </div>

              <div>
                <label htmlFor="travelers" className="label">
                  Travelers
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-secondary !h-11 !w-11 !p-0"
                    aria-label="Fewer travelers"
                    onClick={() => set('travelers', Math.max(1, form.travelers - 1))}
                  >
                    −
                  </button>
                  <input
                    id="travelers"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={8}
                    className="field !w-20 text-center"
                    value={form.travelers}
                    onChange={(e) => set('travelers', Number(e.target.value))}
                    {...err('travelers')}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary !h-11 !w-11 !p-0"
                    aria-label="More travelers"
                    onClick={() => set('travelers', Math.min(8, form.travelers + 1))}
                  >
                    +
                  </button>
                </div>
                {fieldError('travelers')}
              </div>

              <div
                role="radiogroup"
                aria-labelledby="cabin-label"
                aria-describedby={errors.cabin ? 'cabin-error' : undefined}
              >
                <p id="cabin-label" className="label">
                  Cabin category
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {CABINS.map((c) => (
                    <label
                      key={c.id}
                      className={`cursor-pointer rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-mist-600 ${form.cabin === c.id ? 'border-mist-700 bg-mist-50' : 'border-sand-300 bg-white hover:bg-sand-100/60'}`}
                    >
                      <input
                        type="radio"
                        name="cabin"
                        value={c.id}
                        checked={form.cabin === c.id}
                        onChange={() => set('cabin', c.id)}
                        className="sr-only"
                      />
                      <span className="block font-semibold text-bark-900">{c.name}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-bark-600">
                        {c.blurb}
                      </span>
                      <span className="mt-2 block text-xs font-medium text-mist-800">
                        {c.multiplier === 1
                          ? 'Base fare'
                          : `+${Math.round((c.multiplier - 1) * 100)}% on base fare`}
                      </span>
                    </label>
                  ))}
                </div>
                {fieldError('cabin')}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="space-y-6">
              <legend className="sr-only">About you</legend>
              <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
                Tell us about you
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="label">
                    First name
                  </label>
                  <input
                    id="firstName"
                    autoComplete="given-name"
                    className="field"
                    value={form.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    {...err('firstName')}
                  />
                  {fieldError('firstName')}
                </div>
                <div>
                  <label htmlFor="lastName" className="label">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    autoComplete="family-name"
                    className="field"
                    value={form.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    {...err('lastName')}
                  />
                  {fieldError('lastName')}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="field"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  {...err('email')}
                />
                {fieldError('email')}
              </div>

              <div>
                <label htmlFor="phone" className="label">
                  Phone <span className="font-normal text-bark-600">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  className="field"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  {...err('phone')}
                />
                {fieldError('phone')}
              </div>

              <fieldset>
                <legend className="label">Preferred way to hear from us</legend>
                <div className="flex gap-6 text-sm">
                  {['email', 'phone'].map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="contactMethod"
                        value={m}
                        checked={form.contactMethod === m}
                        onChange={() => set('contactMethod', m)}
                        className="h-4 w-4 accent-mist-700"
                      />
                      {m === 'email' ? 'Email' : 'Phone call'}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="notes" className="label">
                  Anything we should know?{' '}
                  <span className="font-normal text-bark-600">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  maxLength={500}
                  className="field"
                  placeholder="Celebrations, accessibility needs, dietary requirements…"
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  {...err('notes')}
                />
                <div className="mt-1 flex justify-between text-xs text-bark-600">
                  {fieldError('notes')}
                  <span className="ml-auto">{form.notes.length}/500</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-mist-700"
                    checked={form.isAdvisor}
                    onChange={(e) => set('isAdvisor', e.target.checked)}
                  />
                  I’m a travel advisor enquiring on behalf of a client
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-mist-700"
                    checked={form.newsletter}
                    onChange={(e) => set('newsletter', e.target.checked)}
                  />
                  Send me occasional voyage news and offers
                </label>
              </div>

              {/* Honeypot: hidden from people and assistive tech, bots tend to fill it in. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => set('website', e.target.value)}
                />
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
                Review & send
              </h2>
              <p className="text-bark-600">
                Check the details below. You can go back to change anything.
              </p>

              <dl className="divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white text-sm">
                {[
                  ['Cruise', cruise?.title],
                  [
                    'Sailing',
                    cruise && departure
                      ? formatDateRange(departure.date, cruise.nights)
                      : undefined,
                  ],
                  ['Travelers', plural(form.travelers, 'traveler')],
                  ['Cabin', cabin?.name],
                  ['Name', `${form.firstName} ${form.lastName}`],
                  ['Email', form.email],
                  ['Phone', form.phone || '—'],
                  ['Contact via', form.contactMethod === 'phone' ? 'Phone call' : 'Email'],
                  ['Notes', form.notes || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-3 gap-4 px-5 py-3">
                    <dt className="text-bark-600">{label}</dt>
                    <dd className="col-span-2 break-words font-medium text-bark-900">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="text-xs leading-relaxed text-bark-600">
                This is a sample enquiry form for a portfolio project: your details are validated
                and acknowledged by the demo API, but are not stored or sent anywhere.
              </p>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goBack}
                disabled={status === 'submitting'}
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              // Distinct keys matter: without them React reuses this <button> for the submit button
              // below and flips its type mid-click, which submits the form and skips the review step.
              <button key="continue" type="button" className="btn btn-primary" onClick={goNext}>
                Continue
              </button>
            ) : (
              <button
                key="submit"
                type="submit"
                className="btn btn-primary"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Summary */}
      <aside aria-label="Your selection" className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <h2 className="font-serif text-xl font-semibold">Your selection</h2>
          {cruise ? (
            <>
              <p className="mt-4 font-semibold text-bark-900">{cruise.title}</p>
              <p className="text-sm text-bark-600">
                {cruise.embark === cruise.disembark
                  ? `${cruise.embark} round trip`
                  : `${cruise.embark} → ${cruise.disembark}`}{' '}
                · {plural(cruise.nights, 'night')}
              </p>
              {departure && (
                <p className="mt-2 text-sm">{formatDateRange(departure.date, cruise.nights)}</p>
              )}
              <p className="mt-1 text-sm text-bark-600">
                {plural(form.travelers, 'traveler')} · {cabin?.name ?? 'No cabin selected'}
              </p>
              {estimate !== null && (
                <div className="mt-5 border-t border-sand-200 pt-4">
                  <p className="text-xs text-bark-600">Indicative total</p>
                  <p className="font-serif text-3xl font-semibold text-bark-900">
                    {formatPrice(estimate)}
                  </p>
                  <p className="mt-1 text-xs text-bark-600">
                    Excludes flights and optional excursions. Final pricing confirmed by your
                    specialist.
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-bark-600">
              Choose a cruise to see an indicative total.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
