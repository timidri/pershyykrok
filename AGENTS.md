# Agent Guide

This repository is production-facing. Treat changes as if they can affect a live public website, Sanity editors, and SEO.
Use this file as the shared source of truth for Codex, Claude, Antigravity, Copilot, and other AI-assisted development tools.

## Repository History Safety

`main`'s current tip is clean and safe to work from. All branches have been clean since 2026-07-26.

A build-time supply-chain payload was merged into `main` on 2026-06-01 (PR #15) and reverted about two
hours later. The merge commit `4ed22e084ae9c9b4cc1ce80380ca1e7305d10557` still carries the poisoned
tree as an ancestor of current `main`'s history.

- **Never check out or build a historical commit at or before `4ed22e084ae9c9b4cc1ce80380ca1e7305d10557`
  on `main`.** The payload runs at build time, so building an affected tree executes it. Read old trees
  only with `git show`/`git cat-file`/`git grep` against a specific ref — never `git checkout` them and
  never install or build from them.
- That commit is permanently reachable through GitHub's pull-request ref for PR #15
  (`refs/pull/15/head`) and cannot be deleted from this repository. Fetching all refs (e.g. `git fetch
  --all` variants that pull PR refs) will pull it down.
- GitHub's merge commit signature on that PR is valid but does **not** mean the tree is clean — a valid
  signature is not a defense here and must not be treated as one.
- The only durable fix would be a fresh repository; that has not been adopted. This is documented
  instead so no contributor or tool is surprised by it.

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

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
