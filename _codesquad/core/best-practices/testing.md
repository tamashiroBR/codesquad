---
id: testing
name: "Testing & Verification"
whenToUse: |
  Creating agents that design test strategy, write unit/integration/e2e tests, drive TDD,
  or verify that an implementation meets its acceptance criteria.
  NOT for: writing production code, reviewing diffs, deploying.
version: "1.0.0"
---

# Testing & Verification — Best Practices

## Core Principles

1. **A test asserts behavior, not implementation.** Test the observable contract: given this input, the function returns/throws/emits that. Tests coupled to internal structure break on every refactor and protect nothing.

2. **A test that cannot fail proves nothing.** Before trusting a passing test, confirm it fails when the behavior is broken. A green test you have never seen fail is a decoration. (TDD makes this automatic: red first, then green.)

3. **Test the edge cases the spec named, not just the happy path.** The happy path rarely ships the bug. Empty, max-size, null, negative, unauthorized, concurrent, malformed — these are where defects live. One happy-path test per feature is the floor, not the goal.

4. **Use the project's framework and runner.** If the repo uses Vitest, write Vitest — not Jest. Match the existing test file location, naming, and setup. A test the project's CI won't run does not exist.

5. **Isolate the unit; integrate the seams.** Unit tests mock external boundaries (network, DB, clock) so they are fast and deterministic. Integration tests exercise the real seams between modules. End-to-end tests prove the whole path works. Pick the cheapest level that can catch the class of bug.

6. **Determinism is non-negotiable.** No real time, no real network, no test-order dependence, no shared mutable state between tests. A flaky test trains the team to ignore red, which is worse than no test.

## Test Strategy (choose per change)

- **Pure logic / transforms** → unit tests, exhaustive on edge cases.
- **Module boundaries / DB queries / API handlers** → integration tests against a real (test) instance or a faithful fake.
- **Critical user journeys** → a few e2e tests; keep them few, they are slow and brittle.
- **Bug fix** → a regression test that fails on the old code and passes on the new (see the debugging discipline).

## Methodology

1. **Read the acceptance criteria.** Each criterion maps to at least one test.
2. **Enumerate cases:** happy path + every edge/failure case named in the spec.
3. **Pick the level** (unit/integration/e2e) for each case — cheapest that catches it.
4. **Write the test, watch it fail** for the right reason.
5. **Implement (or let the implementer implement) until green.**
6. **Check coverage of *cases*, not just lines.** 100% line coverage with no edge-case assertions is a false signal.
7. **Run the full suite** to confirm nothing else broke.

## Output Format (verification report)

```markdown
# Verification — {feature}

## Cases covered
| Criterion | Test | Level | Status |
|-----------|------|-------|--------|
| valid login returns session | auth.test.ts:18 | unit | pass |
| expired token rejected | auth.test.ts:31 | unit | pass |
| IdP timeout → 503 | auth.int.test.ts:9 | integration | pass |

## Gaps
- Concurrent-login case from the spec is not yet covered.

## Command
`npm test` — 24 passed, 0 failed, 0 skipped.
```

## Anti-Patterns

- Asserting on internal state instead of observable behavior
- Mocking the very thing under test
- A single happy-path test standing in for the spec
- Tests that pass whether or not the code is correct
- Snapshot tests used as a substitute for thinking about expected output
- Skipped/`.only` tests left in the suite
