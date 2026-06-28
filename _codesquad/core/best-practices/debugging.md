---
id: debugging
name: "Debugging & Root-Cause Analysis"
whenToUse: |
  Creating agents that reproduce a bug, isolate it, find the true root cause (not the
  symptom), fix it, and add a regression test that fails before the fix and passes after.
  NOT for: building new features, reviewing unrelated code, refactoring for style.
version: "1.0.0"
---

# Debugging & Root-Cause Analysis — Best Practices

## Core Principles

1. **Reproduce before you theorize.** A bug you cannot reproduce is a rumor. The first deliverable is a minimal, reliable reproduction — the smallest input and steps that trigger it every time. No fix is trusted until it is checked against a real reproduction.

2. **Fix the cause, not the symptom.** A `try/catch` that swallows the error makes the symptom disappear and the bug permanent. Trace the failure back to the line where reality first diverged from intent, and fix it there.

3. **Change one thing at a time.** Shotgun debugging — editing five things and re-running — destroys the information you need. Form one hypothesis, make one change, observe, keep or revert. The discipline is binary search over causes.

4. **The regression test is part of the fix.** Every bug fix ships with a test that fails on the *unfixed* code and passes on the fixed code. This is what proves you fixed the real thing and stops it from coming back. A fix without this test is incomplete.

5. **Read the actual error, the whole stack, and the real values.** Most bugs confess in the stack trace or the first divergent value. Print/inspect the real data at the boundary; do not reason from what you assume the data is.

## Methodology — Reproduce → Isolate → Diagnose → Fix → Verify

1. **Reproduce.** Find the smallest reliable trigger. Capture the exact input, environment, and expected-vs-actual. If it is intermittent, find what makes it deterministic (a fixed seed, a forced clock, a specific record).

2. **Isolate.** Narrow the surface: which module, which function, which line? Bisect — by commit (`git bisect`), by input, or by commenting out halves. Each step should roughly halve the search space.

3. **Diagnose the root cause.** State the cause in one sentence: "the token expiry check uses `>` so a token expiring this exact second passes." If you cannot state it in one sentence, you have not found it yet — keep isolating. Distinguish the *cause* from its *symptoms* downstream.

4. **Write the failing regression test.** Encode the reproduction as a test. Run it; confirm it fails for the right reason on the current code.

5. **Fix at the cause.** Make the smallest change that addresses the root cause. Resist the urge to refactor surrounding code in the same change — that hides the fix and inflates the blast radius.

6. **Verify.** The regression test passes. The full suite still passes. The original reproduction no longer reproduces.

## Output Format

```markdown
# Bug Report & Fix — {bug}

## Reproduction (minimal)
Input: ...  ·  Steps: ...  ·  Expected: ...  ·  Actual: ...

## Root cause (one sentence)
`src/auth.ts:42` compares expiry with `>` instead of `>=`, so a token expiring on the current second is accepted.

## Why the symptom looked different
Users saw "random logouts" downstream because the stale session was later rejected by the gateway, masking the origin.

## Fix
`>` → `>=` at auth.ts:42. No other change.

## Regression test
`auth.test.ts:54` — asserts a token expiring exactly now is rejected. Fails on old code, passes on new.

## Verification
Reproduction gone · regression test green · full suite 25/25.
```

## Anti-Patterns

- Catching and swallowing the error to make it "go away"
- Editing multiple places at once and losing track of which change mattered
- Declaring victory without a regression test
- "Fixing" by adding a retry/sleep that hides a race instead of resolving it
- Reasoning about assumed data instead of inspecting the real values
- Bundling an unrelated refactor into the fix
