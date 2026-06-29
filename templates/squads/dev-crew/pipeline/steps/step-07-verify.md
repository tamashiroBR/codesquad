# Step 07 — Verify (agent: tester)

Dispatch **Tânia Teste** with `tasks/write-and-run-tests.md`. Writes tests in the project's
real framework for every acceptance criterion + edge case, runs the suite via `run-tests`,
and produces `output/verification-report.md` with a GREEN/RED verdict.

**Gate `green-suite`:** if RED, return to step-06 with the report (max 3 cycles, then escalate
to the user). Only GREEN proceeds to review.
