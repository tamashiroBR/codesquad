# Definition of Done

A change is "done" only when ALL of these hold:

- [ ] Every acceptance criterion in the spec has a passing test
- [ ] Edge cases named in the spec are covered by tests
- [ ] Lint, typecheck, and the full test suite are green (verified via run-tests, not asserted)
- [ ] The change is limited to the approved scope (no drive-by edits)
- [ ] Refactors and behavior changes are in separate commits
- [ ] No secrets, credentials, or generated artifacts committed
- [ ] Code review verdict is APPROVE (no open BLOCKER or MAJOR)
- [ ] A bug fix carries a regression test that fails on the old code
- [ ] Public API / contract changes are documented
- [ ] The PR body links spec, design, verification, and review
