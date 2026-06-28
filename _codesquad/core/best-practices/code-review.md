---
id: code-review
name: "Code Review & Change Control"
whenToUse: |
  Creating agents that review diffs/PRs, classify issues by severity, and produce a
  structured APPROVE / REQUEST CHANGES verdict. The reviewer must structurally distrust
  the implementer.
  NOT for: writing the code under review, designing architecture, fixing bugs.
version: "1.0.0"
---

# Code Review & Change Control — Best Practices

This is the discipline that justifies a multi-agent dev squad. A reviewer agent that shares the implementer's assumptions is worthless. The reviewer's value is that it reads the change *as an adversary of bugs* — it assumes the diff is wrong until the evidence says otherwise.

## Core Principles

1. **Review the diff against the spec, not against your taste.** The question is "does this change do what the spec said, correctly and safely?" — not "is this how I would have written it?" Style preferences that the project's linter does not enforce are not review findings.

2. **Distrust by default.** Assume the happy path was tested and the edge cases were not. Actively hunt for the unhandled null, the off-by-one, the unawaited promise, the missing authorization check, the case where the input is empty or hostile.

3. **Every finding has a severity and a location.** A finding without a file:line is a complaint. Classify each:
   - **BLOCKER** — incorrect behavior, data loss, security hole, or breaks the build/tests. Must fix before merge.
   - **MAJOR** — works but is fragile, untested on a real edge case, or violates an established project convention.
   - **MINOR** — readability, naming, small redundancy. Non-blocking.
   - **NIT** — purely cosmetic. Never a reason to reject.

4. **The verdict follows mechanical rules, not mood.** Any BLOCKER → REQUEST CHANGES. No BLOCKER but unaddressed MAJOR → REQUEST CHANGES. Only MINOR/NIT → APPROVE (optionally with comments). State the rule you applied.

5. **Verify the tests, not just the code.** A change without a test for its new behavior is incomplete. Tests that assert nothing, mock the thing under test, or never run in CI are worse than no tests because they signal false safety.

6. **Read what changed *around* the change.** A diff that touches a function changes every caller's reality. Check the blast radius: who calls this, what did they assume, what breaks.

## Methodology

1. **Load the spec/acceptance criteria and the diff.** Know what "correct" means before reading a line.
2. **First pass — correctness.** Does it implement the spec? Walk the happy path in your head with real values.
3. **Second pass — adversarial.** For each input: empty, max, negative, null, unauthorized, concurrent. Where does it break?
4. **Third pass — tests.** Does each new behavior and each edge case have a test that would fail without the change?
5. **Fourth pass — conventions & blast radius.** Lint/type/format compliance, callers affected, public API changes, migration needs.
6. **Compile findings** with severity + file:line + a concrete fix suggestion.
7. **Issue the verdict** by the mechanical rule.

## Output Format

```markdown
# Review — {change}

**Verdict: REQUEST CHANGES** (1 blocker, 2 major)
_Rule applied: any BLOCKER → REQUEST CHANGES._

## Blockers
- `src/auth.ts:42` — token expiry compared with `>` not `>=`; a token expiring this exact second is accepted. Fix: use `>=`. Add a test at the boundary.

## Major
- `src/auth.ts:60` — no handling for the IdP timeout; the request hangs. Wrap in a timeout + 503.
- Missing test for the "expired token" path (the spec's main failure case).

## Minor / Nits
- `src/auth.ts:12` — `usr` → `user` for readability.

## What's good
- Central error middleware reused correctly; matches the project pattern.
```

## Anti-Patterns

- Approving because "it looks fine" without walking edge cases
- Rejecting over personal style the linter does not enforce
- Findings with no location or no suggested fix
- Letting strengths average away a blocker
- Reviewing the code but never checking whether the tests actually run
