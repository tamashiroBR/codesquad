# Task — Refactor in Small Steps

Transform structure while preserving behavior.

1. Read `output/refactor-plan.md` (approved) and `output/safety-net.md`.
2. Execute the plan as a sequence of **named refactoring moves** (Extract Function, Inline,
   Rename, Move, Introduce Parameter Object, Replace Conditional with Polymorphism, ...).
3. After EVERY step: run the suite. If red, revert that single step and reconsider — never
   patch forward.
4. One logical commit per step: `refactor: <move> in <target>`. No feature/fix mixed in.
5. If a public API must change, stop and record a version note / ADR before continuing.

Write `output/refactor-report.md`:
- Ordered list of steps, each with the move name and the commit hash
- Before/after of the targeted metric (cyclomatic complexity, duplication, function length) where meaningful
- Any deviation from the plan and why
