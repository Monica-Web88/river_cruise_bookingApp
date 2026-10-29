import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CRUISES } from '../data/cruises';
import { collectErrors, contactSchema, estimateTotal, inquirySchema, tripSchema } from './inquiry';

const trip = { cruiseSlug: 'danube-imperial-capitals', departure: '2027-04-10', travelers: 2, cabin: 'french' };
const contact = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '',
  contactMethod: 'email',
  notes: '',
  isAdvisor: false,
  newsletter: true,
};

describe('tripSchema', () => {
  it('accepts a valid trip', () => assert.ok(tripSchema.safeParse(trip).success));

  it('rejects bad traveler counts and unknown cabins', () => {
    assert.ok(!tripSchema.safeParse({ ...trip, travelers: 0 }).success);
    assert.ok(!tripSchema.safeParse({ ...trip, travelers: 9 }).success);
    assert.ok(!tripSchema.safeParse({ ...trip, travelers: 1.5 }).success);
    const r = tripSchema.safeParse({ ...trip, cabin: '' });
    assert.ok(!r.success);
    if (!r.success) assert.equal(collectErrors(r.error).cabin, 'Please choose a cabin category');
  });
});

describe('contactSchema', () => {
  it('accepts a valid contact', () => assert.ok(contactSchema.safeParse(contact).success));

  it('validates email and names', () => {
    const r = contactSchema.safeParse({ ...contact, email: 'nope', firstName: '  ' });
    assert.ok(!r.success);
    if (!r.success) {
      const e = collectErrors(r.error);
      assert.equal(e.email, 'Enter a valid email address');
      assert.equal(e.firstName, 'Please enter your first name');
    }
  });

  it('requires a phone number when phone is the preferred method', () => {
    const r = contactSchema.safeParse({ ...contact, contactMethod: 'phone' });
    assert.ok(!r.success);
    if (!r.success) assert.equal(collectErrors(r.error).phone, 'Add a phone number so we can call you');
    assert.ok(contactSchema.safeParse({ ...contact, contactMethod: 'phone', phone: '+1 (424) 441-0000' }).success);
  });

  it('rejects letters in the phone field and over-long notes', () => {
    assert.ok(!contactSchema.safeParse({ ...contact, phone: 'call me' }).success);
    assert.ok(!contactSchema.safeParse({ ...contact, notes: 'x'.repeat(501) }).success);
  });
});

describe('inquirySchema (server-side)', () => {
  it('accepts the combined payload', () => assert.ok(inquirySchema.safeParse({ ...trip, ...contact }).success));

  it('lets the honeypot value through the schema so the service can drop it quietly', () => {
    assert.ok(inquirySchema.safeParse({ ...trip, ...contact, website: 'http://spam.example' }).success);
  });

  it('rejects non-JSON-shaped input', () => {
    assert.ok(!inquirySchema.safeParse(null).success);
    assert.ok(!inquirySchema.safeParse({ ...trip, ...contact, travelers: '2' }).success);
  });
});

describe('estimateTotal', () => {
  const cruise = CRUISES.find((c) => c.slug === 'danube-imperial-capitals');

  it('multiplies fare by cabin and travelers', () => {
    assert.equal(estimateTotal(cruise, '2027-04-10', 2, 'deluxe'), 2899 * 2);
    assert.equal(estimateTotal(cruise, '2027-04-10', 2, 'suite'), Math.round(2899 * 1.75 * 2));
  });

  it('returns null for unknown departures or cabins', () => {
    assert.equal(estimateTotal(cruise, '2030-01-01', 2, 'deluxe'), null);
    assert.equal(estimateTotal(cruise, '2027-04-10', 2, 'penthouse'), null);
    assert.equal(estimateTotal(undefined, '2027-04-10', 2, 'deluxe'), null);
  });
});
