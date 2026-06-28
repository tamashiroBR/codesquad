# Task — Adversarial Diff Review

1. Read `output/pr-context.md` and the diff.
2. Review every changed hunk as an adversary of bugs. For each issue produce a finding:
   `[SEVERITY] file:line — problem — suggested fix`. Severities per `pipeline/data/review-rubric.md`.
3. Mandatory security pass (`security-review`): injection, authz/authn, secrets in the diff,
   risky new dependency, unsafe deserialization. Treat all input as hostile.
4. Check the tests: is the new behavior actually covered? Missing coverage for new behavior is MAJOR.
5. Assess blast radius — what else this change can break.

Write `output/findings.md`: findings grouped by severity (BLOCKER/MAJOR/MINOR/NIT), each with
file:line and a fix, plus a "What's good" section.
