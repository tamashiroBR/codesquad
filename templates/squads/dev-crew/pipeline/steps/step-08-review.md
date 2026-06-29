# Step 08 — Adversarial Review (agent: reviewer)

Dispatch **Rui Revisor** with `tasks/review-change.md`. Reviews the diff against the spec as an
adversary of bugs — correctness, edge cases, test coverage, conventions, security, blast radius.
Produces `output/review.md` with a mechanical verdict.

**Gate `review-verdict`:** REQUEST CHANGES returns to step-06 with findings. Only APPROVE
enables the PR checkpoint.
