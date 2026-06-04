# Google indexing remediation plan (canonical host + redirect signals)

## Context observed in this codebase

- Canonical URLs are built from `siteSettings.seo.canonicalBaseUrl` and normalized so `pershyykrok.nl` becomes `www.pershyykrok.nl` in page HTML.
- `robots.txt` and `sitemap.xml` also normalize bare host to `www.pershyykrok.nl`.
- Root route `/` currently uses Astro redirects to `/ua`.

## Goal

Make Google consistently select `https://www.pershyykrok.nl` as canonical host and reduce mixed host indexing.

## Plan

1. **Decide a single canonical host and keep it stable**
   - Keep canonical at `https://www.pershyykrok.nl` (do **not** switch canonicals back to bare domain).
   - Ensure Sanity `siteSettings.seo.canonicalBaseUrl` is set to the `www` host and remains unchanged.

2. **Upgrade host redirects to permanent (301/308) at edge/platform level**
   - Add a domain-level redirect from `https://pershyykrok.nl/*` to `https://www.pershyykrok.nl/*` with path and query preserved.
   - Prefer 301 or 308 for canonicalization; avoid 307 for permanent host moves.
   - Implement this in hosting config (Vercel project/domain redirect), not only inside app runtime.

3. **Keep canonical tags, sitemap, and robots aligned to the same host**
   - Verify every page emits `<link rel="canonical">` on `www`.
   - Verify generated sitemap URLs all use `www`.
   - Verify `robots.txt` contains sitemap URL on `www`.

4. **Eliminate mixed internal links**
   - Audit content/settings for hardcoded `https://pershyykrok.nl` links and replace with `https://www.pershyykrok.nl`.
   - Keep all nav/footer/content links either relative or `www` absolute links.

5. **Strengthen alternate signals and crawl consistency**
   - Ensure both hosts are verified in Google Search Console.
   - Submit only the `www` sitemap property.
   - Request reindexing for a small set of key pages after redirects are live.

6. **Validate end-to-end before and after deploy**
   - `curl -I https://pershyykrok.nl/ua` should return permanent redirect to `https://www.pershyykrok.nl/ua`.
   - `curl -I https://www.pershyykrok.nl/ua` should be 200.
   - Source HTML should show canonical URL on `www` for sampled pages.
   - Re-check GSC "Page indexing" and "Duplicate, Google chose different canonical" over 2-6 weeks.

## Rollout checklist

- [x] Platform redirect configured as permanent from bare -> www (`apps/web/vercel.json`).
- [x] Bare-domain root reaches `https://www.pershyykrok.nl/ua` through permanent redirects.
- [x] `siteSettings.seo.canonicalBaseUrl` defaults to `https://www.pershyykrok.nl` in Studio schema.
- [x] Sitemap/robots inspected in production and aligned to `www` (verified 2026-05-22).
- [x] Internal hardcoded bare-domain links replaced (repo audit found no bare-domain app links).
- [ ] Search Console re-submission and monitoring started.

## Production verification notes

Checked 2026-05-22:

- `https://pershyykrok.nl/ua` and `/ru` return permanent `308` redirects to the `www` host.
- `https://www.pershyykrok.nl/ua/` and `/ru/` return `200` and emit canonical, `hreflang`, and `og:url` values on `www`.
- `https://www.pershyykrok.nl/robots.txt` advertises `https://www.pershyykrok.nl/sitemap.xml`.
- `https://www.pershyykrok.nl/sitemap.xml` contains only `www` URLs.

One minor note: `https://pershyykrok.nl/` currently reaches `/ua` through two permanent redirects (`bare root -> www root -> /ua`). This is not a blocker for canonicalization because both hops are permanent and end on the canonical host, but the Vercel domain redirect can be adjusted later if a single-hop root redirect is desired.

## Expected outcome

With permanent host redirects + consistent canonical/sitemap/internal links, Google should converge on `www` as the selected canonical host over subsequent crawls.
