---
id: devops-ci
name: "DevOps & CI/CD"
whenToUse: |
  Creating agents that design or audit build/test/deploy pipelines, define CI gates,
  or set up release and rollback procedures.
  NOT for: writing application code, reviewing application logic, debugging app bugs.
version: "1.0.0"
---

# DevOps & CI/CD — Best Practices

## Core Principles

1. **The pipeline is the source of truth for "is it shippable".** If it passes locally but the pipeline does not run the check, the check does not exist. Every gate that matters — lint, typecheck, test, build, security scan — runs in CI, on every change, automatically.

2. **Gates are ordered cheap-to-expensive and fail fast.** Lint and typecheck (seconds) run before the test suite (minutes) before e2e/build (longer). The first failure stops the pipeline and reports clearly. Don't make a developer wait ten minutes to learn about a lint error.

3. **Builds are reproducible and pinned.** Lockfiles committed, dependency versions pinned, the same commit produces the same artifact. "Works on my machine" is a pipeline defect, not a person defect.

4. **Every deploy has a rollback.** Before shipping, know how to un-ship: a previous artifact to redeploy, a migration that is reversible or forward-compatible, a feature flag to flip. A deploy you cannot reverse is a bet, not a release.

5. **Secrets come from the platform, never the repo.** CI reads credentials from the secret store. Logs never print them. The pipeline config in the repo references secret names, not values.

## Designing/Auditing a Pipeline

1. **Enumerate the gates** the project needs: install → lint → typecheck → unit → integration → build → (e2e) → deploy.
2. **Order them cheap-to-expensive**, fail-fast.
3. **Make each gate blocking** for merge to the protected branch.
4. **Cache** dependencies and build outputs to keep it fast (slow CI gets bypassed).
5. **Define the deploy + rollback** path and the migration strategy.
6. **Check observability**: does a failed deploy alert someone, and can you tell a bad release from logs/metrics?

## Output Format

```markdown
# Pipeline — {project}

## Gates (in order, all blocking)
1. install (cached)  2. lint  3. typecheck  4. unit  5. integration  6. build  7. deploy

## Deploy / Rollback
- Deploy: build artifact → push → health check
- Rollback: redeploy previous artifact; migrations are forward-compatible (expand/contract)

## Secrets
- Read from platform store: DB_URL, API_KEY (names only in config)

## Gaps found
- No typecheck gate in CI today; types only checked locally.
```

## Anti-Patterns

- Checks that pass locally but are not in CI
- A slow pipeline developers learn to skip
- Deploys with no rollback path
- Irreversible migrations shipped with the feature that needs them
- Secrets or `.env` committed to the repo or printed in CI logs
