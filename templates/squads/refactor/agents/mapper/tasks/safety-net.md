# Task — Safety Net (Characterization Tests)

Establish tests that lock the CURRENT behavior before any change.

1. Check existing coverage of the target. If the suite already pins the relevant behavior, record that.
2. Where behavior is uncovered, write **characterization tests** — they assert what the code
   does now, including quirks. Do NOT "fix" anything here.
3. If the target is hard to test (hidden dependencies, globals), the first refactor move is to
   make it testable (seam extraction, dependency break). Flag this — it needs approval before proceeding.
4. Run the suite and confirm green.

Write `output/safety-net.md`:
- Tests added/identified (file:test name)
- The exact command run and its green result
- Any testability blocker that requires an approved preparatory step
