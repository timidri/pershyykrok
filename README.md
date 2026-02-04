# pershyykrok

Multilingual (Ukrainian/Russian) content site with a Sanity Studio backend and an Astro frontend.

## Purpose

- **Content**: Managed in [Sanity Studio](https://sanity.io) with document-level i18n (Ukrainian and Russian).
- **Site**: Static site built with [Astro](https://astro.build), path-prefix locales (`/ua/`, `/ru/`), shared header/footer, homepage with intro text and meeting info, and slug-based pages.
- **Map**: Single map location and contact details live in Site Settings; homepage shows meeting section and an embedded OpenStreetMap.

## Tech stack

- **Monorepo**: [pnpm](https://pnpm.io) workspaces (`apps/studio`, `apps/web`).
- **CMS**: [Sanity](https://sanity.io) v5 — Studio for content, GROQ, document i18n (`@sanity/document-internationalization`), block content with alignment marks and a PTE plugin for mutually exclusive alignment.
- **Frontend**: [Astro](https://astro.build) v5 — hybrid output (static pages + server preview), [Tailwind CSS](https://tailwindcss.com), [astro-portabletext](https://github.com/theisel/astro-portabletext) for rich text (no React).
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

## Preview setup (Studio → Website)

This repo includes a Studio action that opens a draft preview using a server-rendered preview route on the website.

### Website env vars (apps/web)

- `SANITY_API_READ_TOKEN`: Read token with access to drafts.
- `SANITY_PREVIEW_SECRET`: Shared secret for preview URLs.

### Studio env vars (apps/studio)

- `SANITY_STUDIO_PREVIEW_URL`: Base URL of the website (e.g. `https://pershyykrok.nl`).
- `SANITY_STUDIO_PREVIEW_SECRET`: Must match `SANITY_PREVIEW_SECRET`.
- `SANITY_STUDIO_VERCEL_DEPLOY_HOOK`: Vercel Deploy Hook URL for manual deploys from Studio.

To create the hook in Vercel: Project → Settings → Git → Deploy Hooks.

## Deploy on Vercel (website + studio)

Use **one repo, two Vercel projects**. Connect the same GitHub repo to both projects and set a different **Root Directory** for each.

### 1. Connect the repo (for both projects)

- In Vercel: **Add New Project** → **Import** your Git repository (e.g. `timidri/pershyykrok`).
- Do this **twice** so you have two projects (e.g. `pershyykrok-web` and `pershyykrok-studio`).
- For each project, after import, go to **Settings → General** and set **Root Directory** as below. Leave it empty for none; use **Edit** and enter the path.

### 2. Project 1 — Website (Astro)

- **Root Directory**: `apps/web`
- **Framework Preset**: Astro (optional; Vercel usually detects it)
- **Build Command**: `pnpm run build` (default)
- **Output Directory**: `dist` (default for Astro)
- **Install Command**: `pnpm install` (default; pnpm will use the repo root workspace from `apps/web`)

No env vars required if Sanity `projectId`/`dataset` stay in code. For overrides, add `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` and read them in `apps/web/src/lib/sanity.ts`.

### 3. Project 2 — Studio (Sanity)

- **Root Directory**: `apps/studio`
- **Framework Preset**: Other (or leave default)
- **Build Command**: `pnpm run build` (runs `sanity build`)
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

Optional: if your Sanity project needs env vars (e.g. for CORS or a plugin), add them in the Studio project’s **Settings → Environment Variables**.

### 4. After deploy

- **Website**: Use the Vercel URL (e.g. `pershyykrok-web.vercel.app`).
- **Studio**: Use the Studio project URL (e.g. `pershyykrok-studio.vercel.app`). In [sanity.io/manage](https://sanity.io/manage), add this URL to your project’s **API → CORS origins** (and **Hosts** if you use it) so the Studio can talk to Sanity.
