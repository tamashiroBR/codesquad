---
description: Codesquad multi-agent orchestration framework instructions
alwaysApply: true
---

# Codesquad — Project Instructions

This project uses **Codesquad**, a multi-agent orchestration framework.

## Quick Start

Type `/codesquad` to open the main menu, or use any of these commands:
- `/codesquad create` — Create a new squad
- `/codesquad run <name>` — Run a squad
- `/codesquad help` — See all commands

## Directory Structure

- `_codesquad/` — Codesquad core files (do not modify manually)
- `_codesquad/_memory/` — Persistent memory (company context, preferences)
- `skills/` — Installed skills (integrations, scripts, prompts)
- `squads/` — User-created squads
- `squads/{name}/_investigations/` — Sherlock content investigations (profile analyses)
- `squads/{name}/output/` — Generated content and files
- `_codesquad/_browser_profile/` — Persistent browser sessions (login cookies, localStorage)

## How It Works

1. The `/codesquad` workflow is the entry point for all interactions
2. The **Architect** agent creates and modifies squads
3. During squad creation, the **Sherlock** investigator can analyze reference profiles (Instagram, YouTube, Twitter/X, LinkedIn) to extract real content patterns
4. The **Pipeline Runner** executes squads automatically
5. All tasks run inline and sequentially (no background subagents)
6. Checkpoints pause execution for user input/approval

## Rules

- Always use `/codesquad` commands to interact with the system
- Do not manually edit files in `_codesquad/core/` unless you know what you're doing
- Squad YAML files can be edited manually if needed, but prefer using `/codesquad edit`
- Company context in `_codesquad/_memory/company.md` is loaded for every squad run

## Trae Environment: Subagents

This environment (Trae) does not support spawning background or parallel subagents. When agent instructions (e.g., from the Architect) say to "use the Task tool with run_in_background: true" or similar, you MUST instead execute all tasks inline and sequentially:

1. Inform the user you will process the tasks one by one
2. Execute each task in the current conversation — do NOT skip or defer any of them
3. Complete ALL tasks before asking the next question or moving on

Never announce that you "will do something in parallel" and then skip the work. Always do the actual research inline before continuing.

## Interaction Rules

- NEVER ask more than one question per message — always wait for the user's answer before proceeding to the next question
- When presenting options, always use a numbered list (1. / 2. / 3.) — tell the user to reply with the option number

## Browser Sessions

Codesquad uses a persistent Playwright browser profile to keep you logged into social media platforms.
- Sessions are stored in `_codesquad/_browser_profile/` (gitignored, private to you)
- First time accessing a platform, you'll log in manually once
- Subsequent runs will reuse your saved session
- **Important:** Codesquad uses its own `@playwright/mcp` server configured in `.trae/mcp.json`.
