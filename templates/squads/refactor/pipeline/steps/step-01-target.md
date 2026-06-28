# Step 01 — Alvo do Refactor (checkpoint)

Ask the user for, then save `output/intake.md`:

1. **The target** — the file/function/module to refactor, and the motivation (what hurts:
   duplication, length, coupling, unclear naming).
2. **The boundary** — what must NOT change (public APIs, output format), and what is out of scope.
3. **The target repo** — local path or git URL. Optionally run a codebase investigation so the
   refactorer follows the repo's real conventions.

Restate the target and the boundary in one sentence. This is a checkpoint: do not proceed until
the user confirms. Refactor changes structure, not behavior — if they actually want a behavior
change, route them to feature-builder or bug-hunter instead.
