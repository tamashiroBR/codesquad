# Codesquad — Project Instructions

This project uses **Codesquad**, a multi-agent orchestration framework focused on
**software development**. A squad is a team of role-specialized AI agents that run a
checkpointed pipeline: spec → design → implement → test → review, with the human in
control at each gate.

## Quick Start

Type `/codesquad` to open the main menu, or use any of these commands:
- `/codesquad create` — Create a new squad
- `/codesquad run <name>` — Run a squad
- `/codesquad help` — See all commands

## Directory Structure

- `_codesquad/` — Codesquad core files (do not modify manually)
- `_codesquad/_memory/` — Persistent memory (company/project context, preferences)
- `skills/` — Installed skills (integrations, scripts, prompts: github, run-tests, git-workflow, …)
- `squads/` — Squads. Ships with `feature-builder`, `bug-hunter`, `refactor`, and `pr-review`
- `squads/{name}/_investigations/` — Codebase investigations (stack/convention profiles)
- `squads/{name}/output/` — Generated artifacts (specs, diffs, PRs, reports)

## How It Works

1. The `/codesquad` skill is the entry point for all interactions
2. The **Architect** agent creates and modifies squads
3. During squad creation, the **codebase investigator** can analyze the target repository
   (stack, module system, test framework, conventions) and write a `repo-profile.md` so
   agents follow the project's *real* conventions instead of generic defaults
4. The **Pipeline Runner** executes squads step by step
5. Agents communicate via persona switching (inline) or subagents (background)
6. Checkpoints pause execution for user review/approval; quality gates can send the
   pipeline back a step (e.g. a red test suite or a "request changes" review verdict)

## Why a dev squad instead of just one agent

The host agent is already a capable dev agent, so a squad only earns its keep when it
buys something a single agent doesn't:
- an **enforced multi-role pipeline** with human checkpoints between phases
- a **reviewer that structurally distrusts the coder** (separate persona, severity-graded
  verdict, mechanical pass/fail rule)
- **reproducible team templates** you can re-run across features/bugs

If you just want a quick edit, use the host agent directly. Use a squad when you want the
process enforced.

## Rules

- Always use `/codesquad` commands to interact with the system
- Do not manually edit files in `_codesquad/core/` unless you know what you're doing
- Squad YAML files can be edited manually, but prefer `/codesquad edit`
- Project context in `_codesquad/_memory/company.md` is loaded for every squad run
- The squad runs the project's real commands (test/lint/typecheck/build) verbatim — keep
  `repo-conventions.md` (or the generated `repo-profile.md`) accurate

## Integrations

- `.mcp.json` configures MCP servers used by skills (e.g. GitHub via `github` skill).
  Set tokens in `.env` (see `.env.example`); never commit secrets.
