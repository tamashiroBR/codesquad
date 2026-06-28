---
name: github
description: >
  Read and act on GitHub via the official GitHub MCP server — issues, pull requests,
  reviews, file contents, commits, and CI status. Lets a dev squad open PRs, post
  reviews, read issues, and check pipeline results.
type: mcp
version: "1.0.0"
mcp:
  server_name: github
  command: npx
  args: ["-y", "@modelcontextprotocol/server-github"]
  transport: stdio
env:
  - GITHUB_PERSONAL_ACCESS_TOKEN
categories: [vcs, code, automation, review]
---

# GitHub — Source Control & Collaboration Skill

## When to use

Use this skill when a squad needs to interact with a GitHub repository: reading an issue
to turn into a spec, opening a pull request for a completed change, posting a structured
code review, reading file contents at a ref, or checking whether CI passed on a branch.

## Setup

Create a fine-grained Personal Access Token with the minimum scopes the squad needs
(typically `contents:read`, `issues:read`, `pull_requests:write`). Export it:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="github_pat_..."
```

## Common operations

- **Read an issue** → fetch issue title/body/labels to feed the Requirements agent.
- **Read files at a ref** → pull current source so the implementer works against reality, not assumptions.
- **Open a pull request** → after a change is built and tested, create the PR with the spec summary in the body.
- **Post a review** → the Reviewer agent posts BLOCKER/MAJOR/MINOR findings as review comments on the diff.
- **Check CI status** → read the latest workflow run for a branch before declaring a change shippable.

## Guardrails

- Never force-push or delete branches from a squad pipeline. Pushing happens only at an explicit checkpoint where the user approves.
- Never commit secrets. Review the diff for accidentally staged `.env` or token values before opening a PR.
- The token's scopes are the real permission boundary — the squad cannot do more than the token allows. Keep it minimal.
