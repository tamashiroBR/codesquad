# Repo Conventions

> Filled per project. If the squad ran a codebase investigation, this is replaced by the
> generated `repo-profile.md`. Otherwise, set these before the first run so agents follow
> the project's real conventions instead of generic defaults.

## Stack
- Language / version:
- Runtime:
- Module system (ESM / CommonJS):
- Framework(s):

## Commands (the squad runs these verbatim — fill in the project's real ones)
- Test:
- Run a single test:
- Lint:
- Typecheck:
- Build:

> The `run-tests` skill auto-detects these from the project manifest. Per-stack reference —
> set the fields above only when the project differs from the default. Isolating one test
> is the debugging workhorse:
>
> | Stack | Test | Single test | Lint · Typecheck |
> |-------|------|-------------|------------------|
> | Node / React / React Native | `npm test` | `npm test -- <pattern>` | `npm run lint` · `npm run typecheck` |
> | Python | `pytest -q` | `pytest -q -k <pattern>` | `ruff check .` · `mypy .` |
> | Java (Maven) | `mvn -B test` | `mvn -B -Dtest=<Class#method> test` | `mvn -B compile` |
> | Java/Kotlin (Gradle) | `./gradlew test` | `./gradlew test --tests <pattern>` | `./gradlew compileJava` |
> | Go | `go test ./...` | `go test -run <pattern> ./...` | `go vet ./...` |
>
> React Native: the unit gate is `npm test` (Jest); the native build (Xcode/Gradle) is separate.

## Conventions
- Test framework & location:
- Lint/format config:
- Commit style: Conventional Commits — a bug fix is `fix:`
- Branching: topic branch off `main` (e.g. `fix/<short-slug>`); PR required
- Error handling pattern:
- Logging / observability (where to look for traces):

## Reproduction notes
- How to run the app locally:
- Where logs / stack traces surface:
- Known flaky areas (don't trust a single green run here):

## Do / Don't
- Don't fix a symptom — fix the root cause, then prove it with a regression test
- Don't ship a fix whose regression test passes on the *old* (buggy) code
- Don't commit `.env`, secrets, or build output
