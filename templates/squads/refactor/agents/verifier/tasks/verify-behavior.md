# Task — Verify Behavior Preserved

Prove the refactor changed structure, not behavior.

1. Run the full suite. Confirm the characterization tests pass **unchanged** (diff them against
   `output/safety-net.md` — if they were edited, that is a BLOCKER finding).
2. Read the implementation diff adversarially for hidden behavior change: boundary operators,
   default values, effect ordering, error semantics, returned types.
3. Confirm no public API moved without a recorded note, and coverage did not drop.

Append a Verification section to `output/refactor-report.md`:
- Command run + result (green)
- Confirmation the safety-net tests are byte-identical
- Verdict: APPROVE or REQUEST CHANGES + findings (file:line) that send it back to the refactorer
