# Codebase Investigator — Repository Extractor

Load `sherlock-shared.md` before this file. This extractor produces a `repo-profile.md` for one target repository.

## Input

- A local path (e.g. `../my-app`) or a git URL. If a URL, clone shallow into a temp directory; never push, never modify.
- `investigation_mode`: `fast` (stack + structure + conventions) or `deep` (also map module boundaries and the test/CI setup in detail).
- Output directory and squad name.

## Process

1. **Inventory the root.** List top-level files and folders. Identify the project type from manifest files: `package.json`, `pyproject.toml`/`requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`/`build.gradle`, `composer.json`, etc.

2. **Extract the stack.** From the manifest and lockfiles, record: language(s) and version constraints, runtime (`engines`, `python_requires`), module system (ESM vs CommonJS, `"type": "module"`), framework(s), and the main runtime dependencies (not the full transitive tree — the ones that shape the architecture).

3. **Map the structure.** Record the directory layout that matters: where source lives (`src/`, `lib/`, `app/`), where tests live, where config lives, and the entry point(s). For `deep` mode, identify the main module boundaries and how they depend on each other.

4. **Detect conventions — with evidence.** For each, cite the file/config that proves it:
   - **Test framework + runner** — from devDependencies and scripts (`vitest`, `jest`, `pytest`, `go test`). Note the test command.
   - **Lint/format** — `eslint.config.*`, `.prettierrc`, `ruff.toml`, `.editorconfig`. Note the lint command.
   - **Type checking** — `tsconfig.json` (and whether `strict` is on), `mypy.ini`.
   - **Commit/PR conventions** — `.gitmessage`, `commitlint`, `CONTRIBUTING.md`, recent `git log --oneline -20` to infer the commit style actually in use.
   - **CI** — `.github/workflows/*`, `.gitlab-ci.yml`. Note what gates exist (test, lint, typecheck, build).
   - **Branching** — infer from branch names and CONTRIBUTING if present.

5. **Sample real code.** Open 2–4 representative source files (not generated, not vendored) to capture the *house style*: naming, error-handling pattern, how modules export, comment density, async style. Quote short illustrative snippets (a few lines each) — never large blocks.

6. **Note the gaps and inconsistencies.** Where is there no test coverage? Are there mixed conventions (some files ESM, some CJS)? Is there a `TODO`/`FIXME` density worth flagging? Report neutrally.

7. **Write `repo-profile.md`** in the output directory.

## Output Format

```markdown
# Repo Profile — {repo name}

## Stack
- Language: TypeScript 5.x (tsconfig.json: "strict": true)
- Runtime: Node >=20 (package.json engines)
- Module system: ESM ("type": "module")
- Framework: Express 4 + tRPC
- Key deps: drizzle-orm, zod, ...

## Structure
- Source: `src/`  ·  Tests: `tests/`  ·  Entry: `src/server.ts`
- Module boundaries: `routes/` → `services/` → `db/` (one-directional)

## Conventions (evidence)
- Tests: Vitest — `npm test` runs `vitest run` (package.json)
- Lint: ESLint flat config (eslint.config.js); `npm run lint`
- Types: strict TS, no implicit any
- Commits: Conventional Commits — observed in `git log` (feat:, fix:, chore:)
- CI: .github/workflows/ci.yml gates on lint + typecheck + test

## House Style (samples)
- Named exports only; one default export per route module
- Errors: thrown as `AppError` subclass, caught in central middleware
- Async: async/await throughout, no raw promise chains

## Gaps & Inconsistencies
- `src/legacy/` still uses CommonJS require()
- No integration tests for the payments module
- 14 TODO markers concentrated in `src/billing/`
```

## Quality Criteria

- [ ] Stack claims each cite a real manifest/config key
- [ ] Test, lint, and typecheck commands are recorded verbatim (the squad will run them)
- [ ] Commit style is inferred from actual `git log`, not assumed
- [ ] At least 2 real source files were sampled for house style
- [ ] No secrets, tokens, or `.env` values were copied
- [ ] Inconsistencies are reported neutrally, not "fixed"

## Veto Conditions

Reject and redo if:
1. The stack section is generic ("a Node project") with no version/config evidence — re-read the manifests.
2. The test/lint commands are missing — the squad cannot self-verify without them.
3. Any secret or credential was transcribed — strip it immediately.
