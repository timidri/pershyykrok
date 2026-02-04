---
name: Multilingual Astro Sanity Dev Plan
overview: Implement a shared layout (header + footer) with document-level i18n routing (Russian/Ukrainian), align the homepage with the mockup, add slug-based generic pages, and lay groundwork for future FAQ, stories, and self-test pages.
todos:
  - id: tailwind-fonts
    content: Add Tailwind and define/load fonts in web app (config, BaseLayout or global CSS)
    status: completed
  - id: schema-site-footer
    content: Add siteSettings footer contact; optional homePage ctaButton; Ukrainian first in supportedLanguages
    status: completed
  - id: queries
    content: Add siteSettingsQuery (with resolved nav links); parameterize homePageQuery; add pageBySlugQuery
    status: completed
  - id: layout-header-footer
    content: Create BaseLayout, Header, and Footer components (logo, nav, locale switcher, footer copy + contact)
    status: completed
  - id: routing-pages
    content: Root redirect to /ua; [locale]/index.astro (home); [locale]/[...slug].astro (generic page)
    status: completed
  - id: homepage-map
    content: Style hero from introText; add Call us button; integrate map (static or iframe)
    status: completed
  - id: types-polish
    content: Run Sanity typegen and fix TypeScript/Lint in web app
    status: completed
  - id: deploy-vercel
    content: Deploy web app to Vercel (monorepo root/build, output apps/web/dist); optional env for Sanity; Studio on Sanity hosting or separate
    status: completed
  - id: seo-config
    content: Add SEO configuration to siteSettings and ensure all needed information is there for optimal SEO; use that information where needed in the website
<<<<<<< HEAD
    status: completed
=======
    status: pending
>>>>>>> 8603ab7db05a695c266d1756cd1af63b26983cb8
  - id: faq-page
    content: Add a FAQ page (schema, routing, Studio menu)
    status: completed
  - id: self-test-page
    content: Add a self-test page (schema, routing, Studio menu)
    status: completed
  - id: preview-studio-vercel
    content: Add a preview feature (Studio -> Vercel) so editors can open the site with draft content
    status: completed
  - id: deploy-studio-vercel
    content: Add a deploy feature (Studio -> Vercel) to trigger or link to Vercel deploy from Studio
    status: completed
isProject: false
---

# Multilingual Astro + Sanity Development Plan

## Current state

- **Sanity**: Document i18n via `@sanity/document-internationalization` (ru/ua) on `homePage` and `page`. [siteSettings](apps/studio/schemaTypes/documents/siteSettings.ts) has logo, headerSlogan (ru/ua), mainMenuRu/mainMenuUa (references to page/homePage), footerText (ru/ua). [homePage](apps/studio/schemaTypes/documents/homePage.ts) has introText + meetingSection; [page](apps/studio/schemaTypes/documents/page.ts) has title, slug, body.
- **Astro**: Single [index.astro](apps/web/src/pages/index.astro) with no layout, no header/footer, no locale handling (query hardcodes `language == "ru"`).
- **Gap vs mockup**: No header (logo, nav, language switcher), no footer (copyright + contact), no locale routing, no “Call us” CTA or hero headline/subheadline, no embedded map (only lat/lng placeholder).

## 1. URL and locale strategy

Use **path-prefix locales**: `/ru/` and `/ua/`. **Default language is Ukrainian (ua)**.

- `/` → redirect to `/ua` (default locale)
- `/ua/` → Ukrainian homepage (default)
- `/ru/` → Russian homepage
- `/ua/[slug]/`, `/ru/[slug]/` → generic pages per locale

This keeps document-level content aligned with Sanity’s `language` field and is good for SEO and sharing.

**Implementation**: Use Astro dynamic routes under `src/pages/[locale]/` (e.g. `[locale]/index.astro` for home, `[locale]/[...slug].astro` for pages). Root `index.astro` redirects to `/ua`. A small helper validates `locale` (ru/ua) and redirects or 404s on invalid locale.

## 2. Shared layout (header + footer)

Introduce a single **base layout** used by all pages so header and footer are consistent.

- **New**: [apps/web/src/layouts/BaseLayout.astro](apps/web/src/layouts/BaseLayout.astro) (or `Layout.astro`) that:
  - Accepts `locale`, `title`, and a default slot for page content.
  - Fetches **site settings** once (logo, headerSlogan, mainMenuRu/mainMenuUa, footerText, and footer contact — see schema changes below).
  - Renders **Header**: logo (link to `/${locale}/`), nav (from mainMenuRu or mainMenuUa based on `locale`), language switcher (Українська / Русский with links to same path under the other locale).
  - Renders **Footer**: copyright (footerText.ru/ua), tagline “Анонимно и бесплатно” style text if you add it, and contact block (address, phone, site link).

Nav items are references to `page` or `homePage`. You need a **GROQ query** that expands each menu item’s `link` to get:

- For `homePage`: type so you can build `href = \`/${locale}/`.
- For `page`: `slug.current` and type so you can build `href = \`/${locale}/${slug.current}`.   Resolve the reference in the siteSettings query (e.g.` mainMenuRu[].link->{ _type, "slug": slug.current }`and same for`mainMenuUa`).

**New**: [apps/web/src/components/Header.astro](apps/web/src/components/Header.astro) and [apps/web/src/components/Footer.astro](apps/web/src/components/Footer.astro) (or React if you prefer), used by the base layout. Language switcher in the header should simply link to the same logical page in the other locale (e.g. from `/ru/` to `/ua/`, from `/ru/faq` to `/ua/faq` once FAQ exists).

## 3. Sanity schema tweaks (for mockup and footer)

- **siteSettings**  
  - Add footer contact block: address (string), phone (string), website (url). Used in the footer next to copyright/tagline.
  - **Logo**: The logo is an **SVG file**. Keep `logo` as type `image` in Sanity (the image type accepts SVG uploads). Alternatively, store a path or URL to a static SVG in `public/` if you prefer not to upload it in Studio.
- **homePage**  
  - **No** separate heroTitle/heroSubtitle fields. The hero headline and subheadline live in the **rich text** field `introText`: editors use the first block as H1 (“Вы не одни…”) and the next as H2 or normal for the subheadline (“Встреча Анонимных Алкоголиков…”). Keeps one source of truth and full flexibility (order, extra blocks).
  - Add optional **ctaButton** object (e.g. `label`, and link type: `url` or “phone” from meetingSection) for “Позвоните нам” if you want it editable in Studio; otherwise the site can always render a “Call us” link using `meetingSection.phone`.

No change to document i18n plugin: `homePage` and `page` already use the `language` field. Optionally in [sanity.config.ts](apps/studio/sanity.config.ts) list Ukrainian first in `supportedLanguages` so the Studio default aligns with the site default (ua).

## 4. Queries and data fetching

- **Site settings** (single doc): query in the layout; include logo, headerSlogan, mainMenuRu/mainMenuUa with resolved `link` (expand to `_type` and `slug.current` for page), footerText, and new footer contact fields.
- **Homepage**: existing [homePageQuery](apps/web/src/queries.ts) parameterized by locale: `*[_type == "homePage" && language == $locale][0]{ ... }`.
- **Generic page**: new query `*[_type == "page" && language == $locale && slug.current == $slug][0]{ title, body, slug }`. Used in `[locale]/[...slug].astro`.

Re-export or use a small helper so the Astro app always uses the same `projectId`/`dataset`/apiVersion as in [apps/web/src/lib/sanity.ts](apps/web/src/lib/sanity.ts).

## 5. Astro pages and routing

- **Locale redirect (root)**: `src/pages/index.astro` → redirect to `/ua` (default language Ukrainian).
- **Home**: `src/pages/[locale]/index.astro`  
  - Validate `locale` (ru/ua); 404 or redirect if invalid.  
  - Fetch home page with `homePageQuery` and `locale`.  
  - Use BaseLayout; pass `locale` and `title` (from data).  
  - Main: **introText** (Portable Text — hero is the first H1/H2 blocks in this field), meeting section (sectionTitle, time, address, languages, phone), CTA button (“Call us” from ctaButton or `tel:${meetingSection.phone}`), map (see below).
- **Generic pages**: `src/pages/[locale]/[...slug].astro`  
  - Validate `locale`.  
  - `slug` = array (e.g. one segment “about” → `["about"]`). Join to string and query page by `slug.current`.  
  - If no document found, 404.  
  - Use BaseLayout; render body with Portable Text.

Ensure `<html lang={locale}>` and optional `hreflang` in layout for SEO.

## 6. Homepage details (mockup alignment)

- **Hero**: No separate hero fields. Render **introText** with Portable Text; the first block(s) (H1, then H2 or normal) are the hero. Style them as the main headline and subheadline in CSS/Tailwind.
- **Meeting section**: Keep current structure; add “Call us” button linking to `tel:${meetingSection.phone}` (or use ctaButton from schema if added).
- **Map**: Replace the lat/lng placeholder with an embedded map (static image or iframe using address/geopoint; use env for API key if required).

## 6a. Fonts and styling (Tailwind)

- **Use Tailwind** for the web app: consistent spacing, typography, and responsive layout. Add `@astrojs/tailwind` and configure in [astro.config.mjs](apps/web/astro.config.mjs); define **font families** in `tailwind.config.mjs` (e.g. a primary font for body and headings, and load the actual font files or a Google Font in the base layout).
- **Where fonts are defined**:
  - **Web**: In [apps/web](apps/web): `tailwind.config.mjs` (e.g. `theme.extend.fontFamily`) and load the font in [BaseLayout.astro](apps/web/src/layouts/BaseLayout.astro) via `<link>` (Google Fonts) or `@font-face` in a global CSS file that Tailwind imports. Apply the font class (e.g. `font-sans`) on `<html>` or `<body>` in the layout so all pages use it.
  - **Sanity Studio**: See “Rich text editor” below so the editor matches the site.

## 6b. Rich text editor (Studio) — same font as site or not?

**Recommendation: accept that editor fonts in Studio are not the same as site fonts.**

- **Why skip Studio font matching**: (1) You’re planning **visual editing** and a **quick preview** (see §7a). Once editors have an immediate preview of the real site (or full visual editing inside the site), that becomes the source of truth for “how it looks”; the block editor in Studio is then for structure and content, not pixel-perfect typography. (2) Custom Studio CSS to mirror site fonts adds maintenance (two places to update fonts, risk of drift) and Studio-specific build/customization. (3) For Cyrillic, what matters is that the site uses the right font; editors can still read and edit clearly in Studio’s default font.
- **If you still want Studio to match later**: Add a custom stylesheet in the Studio app that targets the Portable Text editor and sets the same `font-family` (and optionally size) as the site. Document the font in one place so both Astro and Studio stay in sync. Defer this until after visual editing/preview is in place; then decide if it’s still worth it.

## 7a. Future feature: Visual editing and quick preview

Planned for a later phase so editors get an **immediate, accurate preview** of the site (and eventually full visual editing).

- **Quick preview (short term)**  
  - **Goal**: From Studio, open the actual site with the current document’s draft content and see it in the real layout and fonts.  
  - **Options**: (1) **Preview URL / “Open preview”** in Studio: build a URL to the Astro site that shows the document (e.g. by `id` or `slug` + `locale`), using the **drafts** perspective so unpublished changes are visible. Configure a button or link in the document form (e.g. via `document.actions` or a custom document badge) that opens this URL in a new tab. (2) **Embedded iframe** in Studio: same URL but embedded in a panel so editors don’t leave the Studio; requires the Astro app to accept being iframed and to resolve preview params (e.g. `?preview=1&id=...`).  
  - **Astro**: Support a “preview” mode (e.g. query param or cookie) that uses the Sanity client with `perspective: "previewDrafts"` (and optionally a token for private content) so the page renders draft content.  
  - **Sanity**: Use `@sanity/client` with `perspective: "previewDrafts"` and pass the correct `locale` and document identifier in the preview URL.
- **Visual editing (later)**  
  - **Goal**: Click on the live site (or the embedded preview) and edit fields in place, with Studio as the backend.  
  - **Options**: Sanity **Presentation** tool (Visual Editing) with an embedded or external site; or a custom overlay that connects click targets to document paths and opens the right field in Studio. This typically requires the frontend to expose structured data (e.g. `data-sanity` attributes or a manifest) so Studio can map DOM to documents/fields.  
  - **Astro**: When you add this, ensure pages and components output the right identifiers for the Presentation tool (Sanity’s Astro/React integration docs describe the required setup).

**For the current plan**: No implementation now. When you implement quick preview, the “editor font vs site font” question becomes less important because the preview is the real site. Keep the frontend URLs and Sanity document structure (locale, slug, `_id`) predictable so preview URLs are easy to build later.

## 7b. Future content types (FAQ, stories, self-test)

- **Schema**: Add document types `faq` (e.g. question, answer, order), `story` (title, slug, body, optional author/date), and `selfTest` (title, slug, questions/answers or block content). Register them in [schemaTypes/index.ts](apps/studio/schemaTypes/index.ts) and add each to `documentInternationalization` in [sanity.config.ts](apps/studio/sanity.config.ts) with the same `languageField`.
- **Routing**: Either dedicated segments (`/[locale]/faq`, `/[locale]/stories`, `/[locale]/self-test`) or a single catch-all that resolves slug to one of page/faq/story/selfTest. Single catch-all is simpler: one `[locale]/[...slug].astro` that tries page first, then faq, then story, then selfTest (or use a “type” discriminator in the query).
- **Menus**: Extend siteSettings nav link references to include new types so FAQ/Stories/Self-test can be added to the main menu.

No implementation in this phase beyond the plan; implement when you add those features.

## 8. File and dependency checklist

- **Sanity**: Add footer contact (address, phone, website) to siteSettings; optional ctaButton on homePage. Logo stays as image (SVG supported). No heroTitle/heroSubtitle — hero is in introText.
- **Queries**: Site settings query with resolved nav links; homePage by locale; page by locale + slug.
- **Astro**: Add Tailwind; define fonts in tailwind.config + load in BaseLayout. BaseLayout.astro; Header and Footer components; [locale]/index.astro (home); [locale]/[...slug].astro (generic page); root index redirect to `/ua`.
- **Studio**: No custom font styling in this phase (accept different editor font; quick preview will show the real site).
- **Map**: Integrate static or iframe map using meetingSection address or geopoint.
- **Types**: Regenerate sanity-types after schema changes (`pnpm sanity typegen generate` or equivalent).

## Suggested implementation order (and todos)

The list below is the single source of truth for implementation order. Each item is a concrete, trackable step.

1. **Tailwind and fonts (web)**
  - Add `@astrojs/tailwind` to the web app and configure in [astro.config.mjs](apps/web/astro.config.mjs).
  - Create or update `tailwind.config.mjs`: define theme font family (e.g. for body/headings).
  - In BaseLayout (or a global CSS file): load the font (Google Fonts `<link>` or `@font-face`), apply font class on `<html>` or `<body>`.
2. **Sanity schema**
  - In [siteSettings](apps/studio/schemaTypes/documents/siteSettings.ts): add footer contact fields (address, phone, website). Logo remains image (SVG supported).
  - In [homePage](apps/studio/schemaTypes/documents/homePage.ts): add optional `ctaButton` object (label + link type) if desired. No heroTitle/heroSubtitle.
  - Optionally in [sanity.config.ts](apps/studio/sanity.config.ts): put Ukrainian first in `supportedLanguages`.
3. **GROQ queries**
  - Add `siteSettingsQuery`: single doc with logo, headerSlogan, mainMenuRu, mainMenuUa, footerText, footer contact; resolve each menu item’s `link` to `{ _type, "slug": slug.current }` for building hrefs.
  - Parameterize [homePageQuery](apps/web/src/queries.ts) by `$locale` (language filter).
  - Add `pageBySlugQuery`: filter by `language == $locale` and `slug.current == $slug`, return title, body, slug.
4. **Base layout and global components**
  - Create [BaseLayout.astro](apps/web/src/layouts/BaseLayout.astro): accepts `locale`, `title`, default slot; fetches site settings once; sets `<html lang={locale}>`; renders Header + slot + Footer.
  - Create [Header.astro](apps/web/src/components/Header.astro): logo (link to `/${locale}/`), nav from site settings (mainMenuRu or mainMenuUa by locale, hrefs from resolved links), language switcher (Українська / Русский linking to same path under other locale).
  - Create [Footer.astro](apps/web/src/components/Footer.astro): copyright (footerText by locale), tagline if present, contact block (address, phone, website).
5. **Routing and pages**
  - [index.astro](apps/web/src/pages/index.astro): redirect to `/ua` (default locale).
  - Create `src/pages/[locale]/index.astro`: validate locale (ru/ua), fetch home with homePageQuery, render BaseLayout; main content: introText (Portable Text), meeting section, CTA button, map placeholder (or real map).
  - Create `src/pages/[locale]/[...slug].astro`: validate locale; slug array → string; fetch page with pageBySlugQuery; 404 if none; render BaseLayout and body (Portable Text).
6. **Homepage content and map**
  - Style introText so first H1/H2 act as hero (Tailwind typography).
  - Add “Call us” button (tel: link from meetingSection.phone or ctaButton).
  - Replace map placeholder with static map image or iframe (address/geopoint); use env for API key if needed.
7. **Types and polish**
  - Run Sanity typegen (e.g. `pnpm sanity typegen generate` in studio) and fix any TypeScript/Lint errors in the web app.

**Not in this phase**: Studio font matching (accept different editor font); visual editing; quick preview; FAQ, stories, self-test content types. Those are planned in §7a and §7b.

This keeps document-level i18n (ru/ua) in Sanity, path-prefix locales in Astro, and header/footer on every page, with a clear path to quick preview and visual editing later.

---

## Deploy on Vercel

Deploy the **web app** (Astro) to Vercel before continuing feature work. Studio can stay on Sanity’s hosting (`pnpm --filter studio deploy`) or be a second Vercel project if you prefer.

### 1. Vercel project (web app)

- **Repository**: Connect the repo; Vercel will detect pnpm from `pnpm-lock.yaml`.
- **Root Directory**: Leave empty (repo root) so the monorepo install works.
- **Build and Output**:
  - **Build Command**: `pnpm --filter web build` (or `pnpm install && pnpm --filter web build` if install isn’t automatic).
  - **Output Directory**: `apps/web/dist`.
  - **Install Command**: `pnpm install` (default).
- **Framework Preset**: Astro (optional; Vercel will infer from `apps/web` if you set Root Directory to `apps/web` instead—see below).

**Alternative (root = web app):** Set **Root Directory** to `apps/web`. Then Build Command = `pnpm run build`, Output = `dist`. Ensure install runs from repo root or that `apps/web` has all deps (it does); pnpm may still need to run from root for workspaces. If install fails, keep root at repo root and use the commands above.

### 2. Environment variables (optional)

- The web app currently has Sanity `projectId` and `dataset` in [apps/web/src/lib/sanity.ts](apps/web/src/lib/sanity.ts). For different prod/staging datasets or project IDs, add env vars (e.g. `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`) and read them in `sanity.ts` so the build uses them.

### 3. Studio

- **Option A**: Deploy Studio with Sanity: from repo root, `pnpm --filter studio deploy` (or `cd apps/studio && npx sanity deploy`). Use the hosted Studio URL for content editing.
- **Option B**: Deploy Studio on Vercel as a second project (Root Directory = `apps/studio`, build = `pnpm run build`). Point the Studio URL to that deployment.

### 4. Post-deploy

- Set the production site URL in Sanity (CORS origins, or any “allowed origins” for the dataset) if required.
- If you use a read token or preview, add the token as an env var in Vercel (e.g. `SANITY_API_READ_TOKEN`) and use it in the web app when needed.

---

## Nice to have (later)

<<<<<<< HEAD
- **Header logo: use Gimp PNG instead of SVG** – The mockup uses a PNG exported from Gimp (with Gimp’s anti-aliasing). Replacing the current SVG logo in Sanity with that PNG (e.g. 280×280 for 2× retina at 140px display) should match the mockup’s look and remove jagged edges. No code change required beyond uploading the PNG in Studio; current Header already requests logo at 80/140/280.
=======
- **Header logo: use Gimp PNG instead of SVG** – The mockup uses a PNG exported from Gimp (with Gimp’s anti-aliasing). Replacing the current SVG logo in Sanity with that PNG (e.g. 280×280 for 2× retina at 140px display) should match the mockup’s look and remove jagged edges. No code change required beyond uploading the PNG in Studio; current Header already requests logo at 80/140/280.
>>>>>>> 8603ab7db05a695c266d1756cd1af63b26983cb8
