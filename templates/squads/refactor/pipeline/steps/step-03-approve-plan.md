# Step 03 — Aprovação do Plano (checkpoint)

Present to the user, then write `output/refactor-plan.md` once approved:
- The named smell and the proposed sequence of refactoring moves (small, reversible).
- Confirmation that the safety net is green (from `output/safety-net.md`).
- Any preparatory "make it testable" step that needs a yes.

Gate `safety-net-green` applies: if the net is red or missing, the plan cannot be approved.
This is a checkpoint — wait for explicit approval before any code changes.
