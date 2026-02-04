# Todo list

Copy of the development plan todos so collaborators can see what is done and what is left.

## Completed

- [x] Add Tailwind and define/load fonts in web app (config, BaseLayout or global CSS)
- [x] Add siteSettings footer contact; optional homePage ctaButton; Ukrainian first in supportedLanguages
- [x] Add siteSettingsQuery (with resolved nav links); parameterize homePageQuery; add pageBySlugQuery
- [x] Create BaseLayout, Header, and Footer components (logo, nav, locale switcher, footer copy + contact)
- [x] Root redirect to /ua; [locale]/index.astro (home); [locale]/[...slug].astro (generic page)
- [x] Style hero from introText; add Call us button; integrate map (static or iframe)
- [x] Run Sanity typegen and fix TypeScript/Lint in web app
- [x] Deploy web app to Vercel (monorepo root/build, output apps/web/dist); optional env for Sanity; Studio on Sanity hosting or separate
- [x] Add SEO configuration to siteSettings and ensure all needed information is there for optimal SEO; use that information where needed in the website
- [x] Add a preview feature (Studio → Vercel) so editors can open the site with draft content
- [x] Reduce duplication between preview routes and main pages in Astro

## To do
- [x] Add a FAQ page (schema, routing, Studio menu)
- [x] Add a self-test page (schema, routing, Studio menu)
- [x] Define a staging workflow with a stable preview URL (staging branch, Vercel alias, Studio preview URL pointing to staging)
- [x] Add a deploy feature (Studio → Vercel) to trigger or link to Vercel deploy from Studio
- [ ] Add missing translations
