# CodeSquad (Dev Edition) — Skill Catalog

Browse available skills for your dev squads. Install any skill with:

```bash
npx codesquad install <skill-name>
```

## Available Skills

| Skill | Type | Description | Env Vars | Install |
|-------|------|-------------|----------|---------|
| [github](./github/) | mcp | Read and act on GitHub — issues, PRs, reviews, file contents, CI status. | `GITHUB_PERSONAL_ACCESS_TOKEN` | `npx codesquad install github` |
| [run-tests](./run-tests/) | script | Run the project's test / lint / typecheck commands and parse results into a pass/fail summary. The verification backbone. | _(none)_ | `npx codesquad install run-tests` |
| [git-workflow](./git-workflow/) | prompt | Branch / commit / PR discipline — conventional commits, one change per commit, human-approved pushes. | _(none)_ | `npx codesquad install git-workflow` |
| [codesquad-agent-creator](./codesquad-agent-creator/) | meta | Scaffold a new agent definition for a squad. | _(none)_ | _(built-in)_ |
| [codesquad-skill-creator](./codesquad-skill-creator/) | meta | Scaffold a new skill following the SKILL.md format. | _(none)_ | _(built-in)_ |

## Skill Types

- **mcp** — Connects to an external MCP server (stdio or HTTP transport)
- **script** — Runs a local script (Node.js, Python, etc.)
- **prompt** — Pure instruction set, no external server or script
- **meta** — Tooling that generates squad artifacts (agents, skills)

## Suggested additions for your stack

These are common dev integrations to add as your squads grow (each is one `SKILL.md`):

- **linter/formatter** as a dedicated script gate (eslint/prettier, ruff/black)
- **package-audit** — `npm audit` / `pip-audit` for the security agent
- **container** — build/run a service in Docker for integration tests
- **issue-tracker** (Jira/Linear) if your specs originate there instead of GitHub Issues

## Directory Structure

Each skill lives in its own folder with a `SKILL.md` file (YAML frontmatter + Markdown body).
Scripts live in a `scripts/` subfolder.

## Adding a New Skill

1. Create a folder under `skills/` named with the skill ID
2. Add a `SKILL.md` with valid YAML frontmatter and a Markdown body
3. Put any scripts in `scripts/`
4. Add the skill to the catalog table above
