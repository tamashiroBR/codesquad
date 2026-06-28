# Step 06 — Postar Review no GitHub (reporter)

After approval, the reporter submits the review via the `github` skill with the event matching
the verdict (`REQUEST_CHANGES` or `APPROVE`) and the body from `output/review.md`, attaching
inline comments at file:line where supported, and returns the posted review URL.
