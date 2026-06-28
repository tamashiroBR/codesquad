# Step 07 — Verify (agent: verifier)
Dispatch **Vera Verde** with `tasks/verify.md`. Runs the regression test on old (fail) and new
(pass) code and the full suite. **Gate:** if the regression did not fail on the old code, the
root cause was wrong — return to step-04.
