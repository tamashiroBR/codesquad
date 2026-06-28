# Task — Gather PR Context

1. Read `output/intake.md` for the PR reference (URL or number) and the repo.
2. Use the `github` skill to fetch: the diff, the PR title/description, the linked issue body,
   and the list of changed files.
3. Summarize the **declared intent** in one sentence. Compare it to the diff — flag scope creep
   (changes unrelated to the stated goal).
4. Run a Definition-of-Done check: tests for new behavior present? description adequate?
   migration/breaking-change noted? Record gaps.
5. Classify risk signals: auth, data migration, new dependency, public API change, concurrency.
6. Where possible, run the suite to know if the PR enters review green or red.

Write `output/pr-context.md`: declared intent, changed files, linked issue, risk signals,
DoD gaps, suite status.
