# Task — Post Review (after human checkpoint)

Only after the PR-post checkpoint is approved:

1. Use the `github` skill to submit the review on the PR with the event matching the verdict
   (`REQUEST_CHANGES` or `APPROVE`) and the body from `output/review.md`.
2. Where the host supports it, attach the findings as inline comments at their file:line.
3. Confirm the posted review URL back to the user.

Never post before the checkpoint. If the user declined posting, leave `output/review.md` as the
deliverable and stop.
