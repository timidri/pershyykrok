# pershyykrok

Multilingual (Ukrainian/Russian) content site with a Sanity Studio backend and an Astro frontend.

## Purpose

- **Content**: Managed in [Sanity Studio](https://sanity.io) with document-level i18n (Ukrainian and Russian).
- **Site**: Static site built with [Astro](https://astro.build), path-prefix locales (`/ua/`, `/ru/`), shared header/footer, homepage with intro text and meeting info, and slug-based pages.
- **Map**: Single map location and contact details live in Site Settings; homepage shows meeting section and an embedded OpenStreetMap.

## Tech stack

- **Monorepo**: [pnpm](https://pnpm.io) workspaces (`apps/studio`, `apps/web`).
- **CMS**: [Sanity](https://sanity.io) v5 — Studio for content, GROQ, document i18n (`@sanity/document-internationalization`), block content with alignment marks and a PTE plugin for mutually exclusive alignment.
- **Frontend**: [Astro](https://astro.build) v5 — static output, [Tailwind CSS](https://tailwindcss.com), [astro-portabletext](https://github.com/theisel/astro-portabletext) for rich text (no React).
- **Types**: Sanity typegen writes query result types to `apps/web/src/sanity-types.ts`; a watch script can regenerate on schema/query changes.

## Installation

1. **Prerequisites**: [Node.js](https://nodejs.org) (LTS) and [pnpm](https://pnpm.io/installation).

2. **Clone and install** (from the repo root):

   ```bash
   git clone <repo-url>
   cd pershyykrok
   pnpm install
   ```

3. **Run the apps**:

   - **Studio** (content editing):  
     `pnpm studio`  
     Or from root: `pnpm --filter studio dev`
   - **Web** (site):  
     `pnpm web`  
     Or from root: `pnpm --filter web dev`
   - **Both** (Studio + web in parallel):  
     `pnpm dev`

4. **Build**: From root, `pnpm build` builds both Studio and web. For web only: `pnpm --filter web build`.

5. **Types**: Regenerate Sanity types after schema or query changes:  
   `pnpm typegen`  
   Or run the watcher:  
   `pnpm watch:types`  
   (watches `apps/studio/schemaTypes/**/*.ts` and `apps/web/src/queries.ts`, then runs studio extract + typegen.)

Optional: if you use Sanity preview or a read token, set the needed env vars (e.g. in `apps/web` or root) as per your setup.
