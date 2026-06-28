# Task — Map Target

Identify the exact refactoring target and name the smell.

1. Read `output/intake.md` for the requested target (file/function/module) and the motivation.
2. Locate it in the repo. Read the surrounding code and its callers (blast radius).
3. Name the dominant **code smell** using `pipeline/data/refactor-catalog.md` (e.g. Long Function,
   Duplicated Code, Feature Envy, Primitive Obsession). One target, one dominant smell.
4. Assess risk: public surface affected, current test coverage of the target, reversibility.

Write `output/target.md`:
- Target (file:symbol), one-line description of what it does today
- Smell (from the catalog) + why it hurts
- Callers / blast radius
- Risk level and current coverage status
