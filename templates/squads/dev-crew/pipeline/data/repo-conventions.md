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
- Lint:
- Typecheck:
- Build:

> The `run-tests` skill auto-detects these from the project manifest. Per-stack reference —
> set the fields above only when the project differs from the default:
>
> | Stack | Test | Lint | Typecheck · Build |
> |-------|------|------|-------------------|
> | Node / React / React Native | `npm test` | `npm run lint` | `npm run typecheck` · `npm run build` |
> | Python | `pytest -q` | `ruff check .` | `mypy .` |
> | Java (Maven) | `mvn -B test` | `mvn spotless:check` (opt-in) | `mvn -B compile` |
> | Java/Kotlin (Gradle) | `./gradlew test` | `./gradlew check -x test` | `./gradlew compileJava` |
> | Go | `go test ./...` | `go vet ./...` | `go build ./...` |
>
> React Native: the unit gate is `npm test` (Jest); the native build (Xcode/Gradle) is a separate, slower gate.

## Conventions
- Test framework & location:
- Lint/format config:
- Commit style: Conventional Commits (feat/fix/refactor/test/docs/chore)
- Branching: topic branch off `main`; PR required
- Error handling pattern:
- Naming conventions:

## Do / Don't
- Don't introduce a new dependency without a recorded reason (ADR)
- Don't change a public API without a version note
- Don't commit `.env`, secrets, or build output
