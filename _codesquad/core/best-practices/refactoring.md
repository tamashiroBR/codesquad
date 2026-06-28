---
id: refactoring
name: "Refactoring & Code Health"
whenToUse: |
  Creating agents that improve code structure without changing behavior — extracting
  functions, removing duplication, reducing complexity — in small, test-backed steps.
  NOT for: adding features, fixing bugs, changing behavior.
version: "1.0.0"
---

# Refactoring & Code Health — Best Practices

## Core Principles

1. **Refactoring changes structure, never behavior.** If the observable behavior changes, it is not a refactor — it is a feature or a bug. The test suite must stay green at every step, with no test edits beyond renames.

2. **Tests first, or do not refactor.** Refactoring without a covering test is just editing and hoping. If the code under change is untested, the first step is to add characterization tests that pin the current behavior — then refactor.

3. **Small steps, each reversible.** Extract one function, run tests, commit. Rename one symbol, run tests, commit. A refactor that touches forty files in one commit cannot be reviewed or reverted. The discipline is a sequence of safe moves.

4. **Separate refactoring from feature work.** Never mix "make the change easy" with "make the change" in the same commit. The reviewer cannot tell which line is the behavior change and which is the cleanup. Refactor in its own commit/PR.

5. **Refactor toward a named goal.** "Clean it up" is not a goal. "Remove the duplication between these three handlers" or "reduce this function from cyclomatic complexity 18 to under 8" is. Measure before and after.

## Common Moves

- **Extract function** — pull a named operation out of a long body.
- **Inline** — collapse a needless indirection.
- **Rename** — make the name say what it does.
- **Remove duplication** — unify three near-identical blocks behind one well-named function (only when they are truly the same concept, not coincidentally similar).
- **Replace conditional with polymorphism / lookup** — when a switch keeps growing.
- **Introduce parameter object** — when a function takes six positional args.

## Methodology

1. **Confirm green.** Run the full suite. Refactoring on red is undefined behavior.
2. **Add characterization tests** if the area is undertested.
3. **Make one move.** Run tests. Commit.
4. **Repeat** until the named goal is met.
5. **Verify behavior is unchanged** end-to-end and the metric improved.

## Anti-Patterns

- Mixing a refactor with a behavior change in one commit
- Refactoring code with no tests and no characterization tests
- Giant single-commit rewrites
- "Cleaning up" with no measurable goal
- Unifying code that is only coincidentally similar (false DRY) — creating a wrong abstraction is worse than duplication
