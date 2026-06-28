---
name: git-workflow
description: >
  Branch, commit, and PR discipline for squads — conventional commits, one logical change
  per commit, and human-approved pushes. A prompt-only skill (no external server) that
  encodes safe version-control habits into the pipeline.
type: prompt
version: "1.0.0"
env: []
categories: [vcs, process, safety]
---

# Git Workflow — Version Control Discipline Skill

## When to use

Use this skill in any squad that produces code changes, so the work lands as clean,
reviewable, reversible history instead of one giant uncheckpointed blob.

## Rules the squad follows

1. **Branch per task.** Create a topic branch off the default branch
   (`feat/<slug>`, `fix/<slug>`). Never commit a squad's work directly to `main`.

2. **One logical change per commit.** A refactor commit and a feature commit are
   separate, even in the same task. The reviewer must be able to read each commit alone.

3. **Conventional commit messages.** `type(scope): summary` — `feat`, `fix`, `refactor`,
   `test`, `docs`, `chore`. The body says *why*, not *what* (the diff says what).
   If the target repo's `git log` shows a different convention, match that instead.

4. **Never commit secrets or generated junk.** Check `git status` before staging; refuse
   to stage `.env`, credentials, or build output. Respect `.gitignore`.

5. **Push only at an approved checkpoint.** The pipeline pauses and asks the user before
   any `git push` or PR creation. Pushing is a human decision, not an autonomous one.

6. **A fix carries its regression test in the same change.** Do not commit a bug fix
   without the test that proves it (see the debugging discipline).

## Checkpoint behavior

Before pushing or opening a PR, present the user with: the branch name, the list of
commits (subject lines), and the diff stat. Proceed only on explicit approval.
