import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createRateLimiter, makeReference, processInquiry } from './inquiryService';

const valid = {
  cruiseSlug: 'danube-imperial-capitals',
  departure: '2027-04-10',
  travelers: 2,
  cabin: 'french',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '',
  contactMethod: 'email',
  notes: '',
  isAdvisor: false,
  newsletter: true,
  website: '',
};

describe('processInquiry', () => {
  it('accepts a valid inquiry and returns a reference', () => {
    const r = processInquiry(valid);
    assert.equal(r.status, 201);
    assert.match(r.body.reference, /^AW-\d{4}-[A-Z0-9]{6}$/);
    assert.equal(r.log.estimate, Math.round(2899 * 1.15 * 2));
    assert.equal('email' in r.log, false, 'log must not contain PII');
  });

  it('returns field errors for invalid input', () => {
    const r = processInquiry({ ...valid, email: 'nope', travelers: 12 });
    assert.equal(r.status, 422);
    assert.equal(r.body.fieldErrors.email, 'Enter a valid email address');
    assert.ok(r.body.fieldErrors.travelers);
  });

  it('rejects a departure that does not exist for the cruise', () => {
    const r = processInquiry({ ...valid, departure: '2030-01-01' });
    assert.equal(r.status, 422);
    assert.ok(r.body.fieldErrors.departure);
  });

  it('rejects an unknown cruise', () => {
    assert.equal(processInquiry({ ...valid, cruiseSlug: 'atlantis' }).status, 422);
  });

  it('silently "accepts" honeypot submissions without logging or revealing anything', () => {
    const r = processInquiry({ ...valid, website: 'http://spam.example' });
    assert.equal(r.status, 201);
    assert.ok(r.body.reference);
    assert.equal(r.log, undefined);
    assert.equal(r.body.fieldErrors, undefined);
  });

  it('rejects garbage payloads', () => {
    assert.equal(processInquiry(null).status, 422);
    assert.equal(processInquiry('hello').status, 422);
    assert.equal(processInquiry([]).status, 422);
  });
});

describe('createRateLimiter', () => {
  it('allows up to max requests per window, then limits', () => {
    const limited = createRateLimiter({ windowMs: 1000, max: 3 });
    const t = 1_000_000;
    assert.equal(limited('a', t), false);
    assert.equal(limited('a', t + 1), false);
    assert.equal(limited('a', t + 2), false);
    assert.equal(limited('a', t + 3), true);
  });

  it('tracks callers independently and recovers after the window', () => {
    const limited = createRateLimiter({ windowMs: 1000, max: 1 });
    const t = 5_000;
    assert.equal(limited('a', t), false);
    assert.equal(limited('a', t + 10), true);
    assert.equal(limited('b', t + 10), false);
    assert.equal(limited('a', t + 2000), false);
  });
});

describe('makeReference', () => {
  it('is deterministic given inputs and always 6 chars', () => {
    assert.equal(makeReference(new Date('2027-05-01T00:00:00Z'), () => 0.123456789), 'AW-2027-4FZZZX');
    assert.match(makeReference(new Date(), () => 0), /^AW-\d{4}-[A-Z0-9]{6}$/);
  });
});
