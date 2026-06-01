# Sanity Schema Deploy Workflow

## Purpose

`.github/workflows/deploy-sanity-schema.yml` deploys the Studio schema after schema files change on `main`.
It is separate from the Vercel web/studio deployments. A failure here does not necessarily mean the public website is down.

The workflow first regenerates `apps/studio/schema.json`. If schema source files changed but the generated schema is
unchanged, the deploy step is skipped because there is no schema shape update to publish.

## Required Token

The workflow uses the repository secret `SANITY_AUTH_TOKEN`.

That token must have schema/studio deploy access for Sanity project `n1ug74wc`, including the grant:

```text
sanity.project/deployStudio
```

In Sanity, create this as a Developer-level token for the project. An Editor token is not sufficient.

## Common Failure

If the workflow fails with:

```text
User is missing required grant sanity.project/deployStudio
```

then the repository secret exists, but the token does not have enough Sanity permissions. Replace `SANITY_AUTH_TOKEN`
with a token that has the required grant, then re-run the workflow.

Shape-neutral refactors, such as moving shared Studio helper code without changing the generated schema, should not
require this token because the workflow skips deployment when `apps/studio/schema.json` is unchanged.

## What Not To Do

- Do not print the token in logs.
- Do not commit tokens or `.env*` files.
- Do not ask an AI agent to create or modify repository secrets; a repository/Sanity owner must do that.
