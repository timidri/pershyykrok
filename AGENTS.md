# Agent Guide

This repository is production-facing. Treat changes as if they can affect a live public website, Sanity editors, and SEO.
Use this file as the shared source of truth for Codex, Claude, Antigravity, Copilot, and other AI-assisted development tools.

## Project Map

- `apps/web`: Astro website, Tailwind, Sanity queries, locale routes (`/ua`, `/ru`).
- `apps/studio`: Sanity Studio schemas, preview/deploy actions, editor tooling.
- `docs`: operational notes and remediation plans.
- `.github/workflows`: CI/deploy automation.
- `scripts/one-off`: one-time or recovery scripts; do not run against production without explicit intent.

## Operating Rules

- Prefer small, reviewable PRs with one clear purpose.
- Do not change secrets, GitHub repository settings, Vercel settings, or Sanity project settings from code.
- Do not print tokens. Use environment variables and redact values in logs or comments.
- Do not mutate Sanity production content unless the task explicitly asks for it.
- If a fix requires owner credentials or external console access, document the exact action instead of guessing.
- Keep Ukrainian/Russian behavior symmetrical unless the request is explicitly locale-specific.
- Keep generated files in sync when schema or query changes require them.

## Validation

Use the narrowest meaningful checks for the change:

- Web changes: `CI=true pnpm --filter web build`
- Studio/schema changes: `CI=true pnpm --filter studio build`
- Schema/query/type changes: `CI=true pnpm --filter studio codemod`
- Formatting/whitespace: `git diff --check`
- One-off scripts: `node --check path/to/script.mjs`

Note pre-existing warnings separately from new failures.

## Sanity And Content

- Schema source lives under `apps/studio/schemaTypes`.
- Web GROQ queries live in `apps/web/src/queries.ts`.
- Sanity typegen writes to `apps/web/src/sanity-types.ts`.
- Public content is managed in Sanity. Avoid hardcoding editor-owned copy or URLs in Astro components.
- Production content changes should be idempotent and documented, preferably in `scripts/one-off`.

## GitHub And AI Workflow

- Keep AI task prompts in GitHub issues or PR comments, not scattered across chat threads.
- Use `@codex` comments only with clear scope, constraints, validation commands, and out-of-scope boundaries.
- If an AI connector says it created a PR, verify that a real GitHub PR and remote branch exist.
- If an AI connector cannot push, a human/local agent may reimplement the small change and open the PR.
- Do not ping maintainers for low-priority maintenance unless a credential or product decision is required.

## PR Expectations

- Explain why the change matters.
- List changed surfaces: web, Studio, Sanity content, CI, docs, or scripts.
- Include validation commands and results.
- Call out any required external action, such as updating `SANITY_AUTH_TOKEN`.
