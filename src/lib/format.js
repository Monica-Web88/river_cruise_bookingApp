const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const shortDateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const monthFmt = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const toUtc = (iso) => new Date(`${iso}T00:00:00Z`);
export const formatPrice = (amount) => usd.format(amount);
export const formatDate = (iso) => dateFmt.format(toUtc(iso));
export const formatMonth = (yearMonth) => monthFmt.format(toUtc(`${yearMonth}-01`));
export function addDays(iso, days) {
  const d = toUtc(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
/** "Apr 10 – Apr 17, 2027" */
export function formatDateRange(startIso, nights) {
  const endIso = addDays(startIso, nights);
  return `${shortDateFmt.format(toUtc(startIso))} – ${dateFmt.format(toUtc(endIso))}`;
}
export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
