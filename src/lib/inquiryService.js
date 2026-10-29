import { getCruiseBySlug } from './catalog';
import { collectErrors, estimateTotal, inquirySchema } from './inquiry';

/**
 * Framework-free business logic for the inquiry API. The route handler only deals with HTTP
 * (reading the request, building the response); everything decidable lives here so it can be
 * unit-tested without a running server.
 */

export const MAX_BODY_BYTES = 10_000;

/**
 * Sliding-window limiter. In-memory, so fine for a demo; in production use an edge or Redis
 * backed limiter because serverless instances do not share memory.
 * Returns a function: (key) => true when the caller should be rejected.
 */
export function createRateLimiter({ windowMs = 60_000, max = 5 } = {}) {
  const hits = new Map();
  return function isLimited(key, now = Date.now()) {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    return recent.length > max;
  };
}

export function makeReference(now = new Date(), random = Math.random) {
  const suffix = random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0');
  return `AW-${now.getUTCFullYear()}-${suffix}`;
}

/**
 * Validates an inquiry payload against the schema and the catalogue.
 * @param {unknown} payload parsed JSON body
 * @returns {{ status: number, body: object, log?: object }}
 */
export function processInquiry(payload) {
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: 422,
      body: {
        message: 'Please correct the highlighted fields.',
        fieldErrors: collectErrors(parsed.error),
      },
    };
  }

  const data = parsed.data;

  // Honeypot tripped: pretend success so bots learn nothing, but do no work.
  if (data.website) {
    return { status: 201, body: { reference: makeReference() } };
  }

  // Never trust the client's idea of which cruises and dates exist.
  const cruise = getCruiseBySlug(data.cruiseSlug);
  const departureExists = cruise?.departures.some((d) => d.date === data.departure);
  if (!cruise || !departureExists) {
    return {
      status: 422,
      body: {
        message: 'That sailing is no longer available. Please choose another departure.',
        fieldErrors: { departure: 'Please choose an available departure' },
      },
    };
  }

  const reference = makeReference();
  return {
    status: 201,
    body: { reference },
    // Non-sensitive fields only (no PII) - a stand-in for a CRM / email integration.
    log: {
      reference,
      cruise: cruise.slug,
      departure: data.departure,
      travelers: data.travelers,
      cabin: data.cabin,
      estimate: estimateTotal(cruise, data.departure, data.travelers, data.cabin),
      isAdvisor: data.isAdvisor,
    },
  };
}
