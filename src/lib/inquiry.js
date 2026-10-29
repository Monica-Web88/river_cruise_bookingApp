import { z } from 'zod';
import { CABINS, CABIN_IDS, getCabin } from '../data/cabins';
/**
 * One schema, two runtimes: the wizard validates each step in the browser,
 * and the API route re-validates the whole payload on the server (never trust the client).
 */
export const tripSchema = z.object({
  cruiseSlug: z.string().min(1, 'Please choose a cruise'),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a departure date'),
  travelers: z
    .number({ invalid_type_error: 'Enter the number of travelers' })
    .int()
    .min(1, 'At least one traveler is required')
    .max(8, 'For groups of more than 8, please contact our team'),
  cabin: z.enum(CABIN_IDS, { errorMap: () => ({ message: 'Please choose a cabin category' }) }),
});
const contactShape = z.object({
  firstName: z.string().trim().min(1, 'Please enter your first name').max(60),
  lastName: z.string().trim().min(1, 'Please enter your last name').max(60),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email')
    .email('Enter a valid email address')
    .max(120),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number is too long')
    .regex(/^[0-9+()\-.\s]*$/, 'Use digits, spaces and + ( ) - only')
    .optional(),
  contactMethod: z.enum(['email', 'phone']),
  notes: z.string().trim().max(500, 'Please keep notes under 500 characters').optional(),
  isAdvisor: z.boolean(),
  newsletter: z.boolean(),
  /** Honeypot: real users never see or fill this field. Checked in the service, not the schema. */
  website: z.string().max(200).optional(),
});
const requirePhoneWhenPreferred = (value, ctx) => {
  if (value.contactMethod === 'phone' && !value.phone?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['phone'],
      message: 'Add a phone number so we can call you',
    });
  }
};
export const contactSchema = contactShape.superRefine(requirePhoneWhenPreferred);
export const inquirySchema = tripSchema.merge(contactShape).superRefine(requirePhoneWhenPreferred);
export function collectErrors(error) {
  const errors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
/** Indicative price: per-person base fare × cabin multiplier × travelers. */
export function estimateTotal(cruise, departureDate, travelers, cabinId) {
  const departure = cruise?.departures.find((d) => d.date === departureDate);
  const cabin = getCabin(cabinId);
  if (!departure || !cabin) return null;
  return Math.round(departure.price * cabin.multiplier * travelers);
}
export { CABINS };
