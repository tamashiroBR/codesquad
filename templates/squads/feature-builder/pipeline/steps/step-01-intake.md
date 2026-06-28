# Step 01 — Intake (checkpoint)

Ask the user for two things, then save `output/intake.md`:

1. **The request** — a feature request in plain language, OR a GitHub issue reference (the
   `github` skill can read the issue body).
2. **The target repo** — a local path or git URL. Optionally run a codebase investigation
   (`mode: codebase`) so agents follow the repo's real conventions.

Confirm the request back in one sentence before proceeding. This is a checkpoint: do not
continue until the user approves the restatement.
