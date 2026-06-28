---
id: code-architecture
name: "Software Architecture & Design"
whenToUse: |
  Creating agents that design module boundaries, data flow, and interfaces; choose
  patterns; or write Architecture Decision Records before implementation.
  NOT for: writing the implementation, reviewing diffs, debugging.
version: "1.0.0"
---

# Software Architecture & Design — Best Practices

## Core Principles

1. **Design the boundaries, not the code.** The architecture phase decides what the modules are, what each owns, and how they talk — not the body of every function. A good boundary is one you can describe in a sentence and test in isolation.

2. **Dependencies point one way.** Cycles between modules are the root of most "why is everything tangled" pain. Decide the direction of dependency (e.g. routes → services → data) and keep it acyclic. Lower layers never import higher ones.

3. **Make the change easy, then make the easy change.** When a feature is hard to add, the design — not the feature — is usually the problem. Note the refactor the design needs, separate it from the feature, and sequence them.

4. **Choose the simplest design that fits the known requirements.** YAGNI. Do not build a plugin system, an event bus, or a generic abstraction for one caller. Add the abstraction when the second real caller arrives, not in anticipation of it.

5. **Every non-obvious decision becomes an ADR.** "Why Postgres over SQLite", "why we duplicated this instead of sharing it" — record the decision, the options considered, and the trade-off, so the next person (or agent) does not relitigate it.

## Methodology

1. **Restate the requirement and the constraints** (performance, scale, existing stack, deadlines). Architecture is constraint-driven.
2. **Identify the core entities and the operations on them.** These become the modules.
3. **Draw the dependency direction** between modules; check it is acyclic.
4. **Define the interfaces at each boundary** (inputs, outputs, errors) — the contracts the implementer will fill in.
5. **Name the trade-off you are making** and the alternative you rejected.
6. **Write the ADR** for each non-obvious choice.
7. **Identify the riskiest assumption** and how to validate it cheaply (a spike, a benchmark) before full implementation.

## Output Format

```markdown
# Design — {feature}

## Modules & Responsibilities
- `auth/` — owns identity verification and session issuance. Depends on: `db/`.
- `db/` — owns persistence. Depends on: nothing.

## Dependency direction
routes → services → db   (acyclic, one-directional)

## Interfaces (contracts)
- `auth.verify(token) -> Session | throws AuthError`

## Decisions (ADR)
- Chose central error middleware over per-route handling. Rejected: per-route (more duplication). Trade-off: one global catch point vs. localized control.

## Riskiest assumption
- The IdP responds < 200ms p95. Validate with a 100-request spike before building on it.
```

## Anti-Patterns

- Designing every function body up front instead of the boundaries
- Circular dependencies between modules
- Premature abstraction for a single caller
- Big-bang rewrites where an incremental strangler would do
- Decisions with no recorded rationale
