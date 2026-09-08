# Agent Instructions

## Start here

- Read this file and any applicable parent `AGENTS.md` files before working.
- Check `.agents/`, `.codex/`, the README, and package/task configuration for additional repository guidance.
- Preserve unrelated user changes in a dirty worktree.

## Secrets and external services

- Inspect local `.env*` and service-specific environment filenames before external operations, but never print secret values.
- Do not commit, log, or persist credentials.
- Before GitHub actions, verify the intended repository, account, and permission. Prefer a repository-scoped `GITHUB_TOKEN` when one is provided; do not assume global GitHub credentials are correct.

## Changes and verification

- Make the smallest change that fulfills the request.
- Run the relevant checks before handing work off.
- Stage and commit only files within the requested scope.

## Project-specific rules

Add durable project conventions, required commands, deployment steps, and integration details below this section.
