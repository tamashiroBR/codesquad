---
id: requirements
name: "Requirements & Specification"
whenToUse: |
  Creating agents that turn a feature request or bug report into a clear spec —
  scope, acceptance criteria, edge cases, and out-of-scope boundaries — before code.
  NOT for: writing code, reviewing code, designing architecture.
version: "1.0.0"
---

# Requirements & Specification — Best Practices

## Core Principles

1. **A request is not a spec.** "Add login" is a wish. A spec states what "login" means here: which identity provider, what happens on failure, session lifetime, rate limiting, and what is explicitly out of scope. The agent's job is to close that gap before anyone writes code.

2. **Acceptance criteria are testable or they are not criteria.** Every criterion must be phrased so a test could pass or fail it. "The page should be fast" is not a criterion. "p95 page load < 800ms on a cold cache" is.

3. **Name the boundaries.** Half of scope creep comes from unstated assumptions. State what is explicitly *out* of scope as clearly as what is in. "Password reset is out of scope for this iteration" prevents the implementer from building it and the reviewer from rejecting its absence.

4. **Edge cases are part of the spec, not a surprise during review.** Empty inputs, concurrent access, the maximum-size case, the offline case, the unauthorized case. Enumerate the ones that apply before implementation, not after a bug.

5. **Don't design the solution.** Requirements describe *what* and *why*, not *how*. "Users must not see each other's data" is a requirement. "Add a `tenant_id` foreign key" is a design decision that belongs to the architecture phase.

## Methodology

1. **Restate the request in one sentence.** If you cannot, you do not understand it yet — ask one clarifying question.
2. **Identify the actors and the trigger.** Who does this, and what starts it?
3. **Write the happy path** as a numbered sequence of observable steps.
4. **Enumerate edge cases and failure modes.** For each, state the expected behavior.
5. **Write acceptance criteria** as a checklist, each independently verifiable.
6. **State out-of-scope items** explicitly.
7. **Flag open questions** that block implementation — do not invent answers to them.

## Output Format

```markdown
# Spec — {feature}

## Summary
One sentence: what changes and for whom.

## Actors & Trigger
- Actor: ...
- Trigger: ...

## Happy Path
1. ...
2. ...

## Edge Cases & Failure Modes
- Empty input → ...
- Unauthorized → ...
- Concurrent write → ...

## Acceptance Criteria
- [ ] Given X, when Y, then Z (verifiable)
- [ ] ...

## Out of Scope
- ...

## Open Questions (blocking)
- ...
```

## Anti-Patterns

- Acceptance criteria that restate the title ("login works")
- Smuggling implementation decisions into requirements
- Leaving failure behavior unspecified ("handle errors gracefully")
- Answering an open question by assumption instead of flagging it
