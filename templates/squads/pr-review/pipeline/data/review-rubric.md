# Review Rubric — Severity & Verdict

## Severity levels
- **BLOCKER** — correctness bug, security hole, data loss, broken build/tests, or a public
  contract broken without note. Must be fixed before merge.
- **MAJOR** — missing tests for new behavior, significant design problem, unhandled edge case,
  or a performance/maintainability issue that will bite soon.
- **MINOR** — small correctness-adjacent improvement, naming, dead code, weak test.
- **NIT** — style/preference the linter does not enforce. Non-blocking by definition.

## Verdict rule (mechanical)
1. Any BLOCKER → **REQUEST CHANGES**.
2. No blocker, but an open MAJOR → **REQUEST CHANGES**.
3. Only MINOR / NIT → **APPROVE** (call out the minors, don't block on them).

No averaging. A pile of NITs never becomes a MAJOR; a MAJOR is never offset by "lots of good stuff".

## Finding format
`[SEVERITY] path/file.ext:line — what's wrong — suggested fix`

Every finding needs a location and a concrete fix. A finding without both does not count.

## Security pass (always)
Injection, authn/authz, secrets committed in the diff, unsafe deserialization, risky new
dependency. Treat all external input as hostile.
