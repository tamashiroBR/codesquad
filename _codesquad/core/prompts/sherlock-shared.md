# Codebase Investigator — Shared Core

This file contains the shared logic for all codebase investigations. It must be loaded before the `sherlock-codebase.md` extractor.

## Purpose

When a user points a squad at an existing repository ("match the conventions of this codebase", "build inside this project"), the Architect dispatches one Investigator subagent per target. Each subagent reads the repo, extracts the real stack, structure, conventions, and test setup, and produces a structured profile.

The investigation output feeds directly into squad data files — making the generated agents, frameworks, and quality criteria grounded in the project's actual conventions rather than generic defaults. A squad that knows the repo uses Vitest, ESM, and conventional commits will not propose Jest, CommonJS, and freeform commit messages.

## How It Works

1. The Architect receives one or more targets during Phase 1 Discovery (a local path or a git URL).
2. For each target, the Architect launches an Investigator subagent in the background using the Task tool.
3. Each subagent runs independently — one repo per subagent.
4. Each subagent produces one file: `repo-profile.md` (or `error.md` on failure).
5. After all subagents complete, the Architect (Design phase) consolidates findings into `consolidated-analysis.md`.
6. The consolidated analysis enriches all Phase 3 extraction artifacts (data files, quality criteria, anti-patterns).

## Ground Rules (apply to every investigation)

- **Read, never write.** The investigator only inspects the target repo. It never modifies, runs, builds, or installs anything. Inspection is read-only.
- **Evidence over inference.** Every claim in the profile must cite a real file path or config key. "Uses TypeScript strict mode" requires pointing at `tsconfig.json`'s `"strict": true`. Do not infer conventions from a single file.
- **Report what is, not what should be.** The investigator documents the project as it exists — including inconsistencies — and does not recommend changes. Recommendations are the squad's job downstream.
- **Respect privacy and secrets.** Never copy secrets, tokens, `.env` values, or credentials into the profile. Note that a `.env.example` exists; never transcribe a real `.env`.
