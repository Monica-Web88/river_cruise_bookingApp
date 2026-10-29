import { NextResponse } from 'next/server';
import { MAX_BODY_BYTES, createRateLimiter, processInquiry } from '@/lib/inquiryService';

export const runtime = 'nodejs';

const isLimited = createRateLimiter({ windowMs: 60_000, max: 5 });

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isLimited(ip)) {
    return NextResponse.json(
      { message: 'Too many requests. Please wait a minute and try again.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ message: 'Request is too large.' }, { status: 413 });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { status, body, log } = processInquiry(payload);
  if (log) console.info('[inquiry]', log);
  return NextResponse.json(body, { status });
}
