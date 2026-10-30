# Dream River Cruises

A production-style **Next.js 14 (App Router) + React 18 + JavaScript (ES6+)** web application: a river-cruise
booking experience with search & filtering, itinerary pages and a multi-step quote flow.

> "Dream" is a fictional brand created for a front-end portfolio. All itineraries, ships and prices are sample content.

## Features

- **Home page**: hero with a no-JS search form, featured voyages, destination tiles, how-it-works, CTA.
- **Cruise search** (`/cruises`): filter by river, departure month, duration, max price, theme and free text; six sort options. Filter state lives in the URL (shareable, back-button friendly) and results are server-rendered.
- **Itinerary pages** (`/cruises/[slug]`): highlights, day-by-day timeline, inclusions, departures table, sticky price card, related cruises, JSON-LD (`TouristTrip`) for rich results.
- **Multi-step inquiry flow** (`/inquire`): 3 steps (voyage, you, review), per-step validation, live price estimate, success screen with reference number. Deep-links from any itinerary pre-fill cruise and departure.
- **API** (`POST /api/inquiries`): Zod validation (same schema as the client), body-size cap, per-IP rate limiting, honeypot, server-side checks that the sailing exists. Business rules live in `src/lib/inquiryService.js` (framework-free and unit-tested); the route only handles HTTP.
- **SEO**: per-page metadata, canonical URLs, `sitemap.xml`, `robots.txt`, structured data.
- **Accessibility (WCAG 2.1 AA aims)**: skip link, landmarks, labelled controls, `aria-live` result count, focus moved to each wizard step heading, `aria-invalid` + described errors, visible focus rings, reduced-motion support, keyboard-operable everything.
- **Performance**: zero image downloads (illustrations are generated SVG), `next/font`, only 3 client components, static + ISR where possible.
- **Security**: HTTP security headers, no `dangerouslySetInnerHTML` except JSON-LD with `<` escaped, untrusted URL params parsed and clamped, server re-validation.

## Tech stack

Next.js 14 · React 18 · JavaScript (ES2022) · HTML5 · Tailwind CSS · Zod · Node test runner · GitHub Actions

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 35 unit tests: filters, validation, API rules, rate limiting, dates, catalogue
npm run lint
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your deployed URL (used for canonical links, sitemap and JSON-LD).

## Rendering strategy

See [`docs/ADR-001-rendering-strategy.md`](docs/ADR-001-rendering-strategy.md).

| Route | Strategy |
|---|---|
| `/` | SSG |
| `/cruises` | SSR (search params) |
| `/cruises/[slug]` | SSG + ISR (1h) |
| `/inquire` | Server component + client island |
| `/api/inquiries` | Route Handler |

## Project structure

```
src/
  app/                 routes, layouts, sitemap, robots, API route
  components/          UI (RiverScene, CruiseCard, CruiseFilters, InquiryWizard, ...)
  data/                typed catalogue + cabin categories (CMS/API stand-in)
  lib/                 pure, tested logic: filters, validation, inquiry service, formatting, analytics shim
docs/                  architecture decision record
```

## Design decisions 

1. **URL as the source of truth for filters.** No client fetching layer; SSR gives crawlable, shareable results.
2. **One Zod schema, two runtimes.** The wizard validates per step in the browser; the API re-validates the full payload.
3. **Data-access seam.** Pages only call `src/lib/catalog.js`, so replacing the in-memory catalogue with Builder.io / Contentful / Sanity plus a booking API touches one file.
4. **Pure functions for business logic** (`filterCruises`, `parseFilters`, `estimateTotal`, `processInquiry`), which keeps them trivially unit-testable.
5. **JSDoc-typed data model** (`src/data/cruises.js`) gives editor autocomplete in plain JavaScript.
6. **Analytics shim** (`track()`) emits funnel events (`inquiry_started`, `inquiry_step_completed`, `inquiry_submitted`, ...) to `window.dataLayer`, ready for GA4/GTM.

