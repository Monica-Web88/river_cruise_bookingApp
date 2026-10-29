# ADR-001: Rendering strategy per route

**Status:** Accepted

## Context
The site has three very different content shapes: marketing content that rarely changes, a search
experience driven by arbitrary filter combinations, and itinerary pages whose prices and
availability change a few times a day. SEO and Core Web Vitals matter most on the first two.

## Decision
| Route | Strategy | Why |
|---|---|---|
| `/` | **SSG** (static) | Same for everyone; served from the CDN with no server work. |
| `/cruises` | **SSR** (dynamic via `searchParams`) | Filter combinations are unbounded, so pre-rendering them is impractical. Server rendering keeps results crawlable, shareable by URL and correct on first paint. |
| `/cruises/[slug]` | **SSG + ISR** (`revalidate = 3600`) | Every itinerary is pre-built, and prices/availability refresh hourly in the background with no redeploy. |
| `/inquire` | **RSC shell + client island** | Page and data are server-rendered; only the stateful wizard ships JavaScript. |
| `/api/inquiries` | **Route Handler** | Server-side validation, rate limiting and honeypot; the client is never trusted. |

## Consequences
- Filter state lives in the URL, so there is no client data-fetching layer to maintain.
- Only three components are client components (`Header`, `CruiseFilters`, `InquiryWizard`), which keeps the JS bundle small and helps INP/LCP.
- ISR gives near-real-time freshness without per-request server cost. If true real-time inventory is
  needed, switch the detail page to on-demand revalidation (`revalidateTag`) triggered by a webhook.
