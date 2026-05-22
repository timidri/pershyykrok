# Sanity Schema Deploy Workflow

## Purpose

`.github/workflows/deploy-sanity-schema.yml` deploys the Studio schema after schema files change on `main`.
It is separate from the Vercel web/studio deployments. A failure here does not necessarily mean the public website is down.

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

## What Not To Do

- Do not print the token in logs.
- Do not commit tokens or `.env*` files.
- Do not ask an AI agent to create or modify repository secrets; a repository/Sanity owner must do that.
