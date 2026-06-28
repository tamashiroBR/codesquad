---
name: run-tests
description: >
  Run the project's test, lint, and typecheck commands and parse the results into a
  pass/fail summary. The verification backbone for a dev squad — lets agents prove a
  change works instead of asserting it does.
type: script
version: "1.0.0"
script:
  command: node
  entry: scripts/run.js
env: []
categories: [testing, verification, ci]
---

# Run Tests — Verification Skill

## When to use

Use this skill whenever a squad needs to *prove* a change is correct: after the implementer
writes code, after a bug fix, before a review, before declaring anything shippable. The
Tester and Reviewer agents depend on it — a green suite is the evidence, not the claim.

## How it works

The skill detects the project's stack from its manifest and runs the real test / lint /
typecheck commands:

- **Node / React / React Native** — reads `package.json` scripts (`test`, `lint`,
  `typecheck`); falls back to `tsc --noEmit` when a `tsconfig.json` exists and to
  `eslint .` when an ESLint config exists but no script is defined.
- **Python** — `pytest`, `ruff check .`, `mypy .`.
- **Java (Maven)** — `mvn -B test`, with `mvn -B compile` as the typecheck gate.
- **Java / Kotlin (Gradle)** — `./gradlew test` (uses the wrapper when present), plus
  `compileJava` and `check`.
- **Go** — `go test ./...` and `go vet ./...`.
- **Anything else** — pass an explicit command: `node scripts/run.js "<command>"`.

A tool that isn't installed is reported as **SKIP** (a gap), never as a failure — a missing
linter must not look like a broken build. The skill returns a structured PASS / FAIL / SKIP
summary per gate and exits non-zero only on a real failure, so the agent acts on the result
instead of re-reading raw logs.

## Usage

```bash
node scripts/run.js            # auto-detect and run test + lint + typecheck
node scripts/run.js test       # run only the test gate
node scripts/run.js "npm run e2e"   # run an explicit command
```

## Guardrails

- The skill runs the project's own commands; it does not invent test commands. If no test
  script exists, it reports that gap rather than passing silently.
- A non-zero exit is a real failure. Agents must not "work around" a red suite by editing
  the test to pass — that is a code-review BLOCKER.
