# Refactor Catalog — Smells → Moves

The mapper names ONE dominant smell; the refactorer applies the matching named moves in small steps.

## Bloaters
- **Long Function** → Extract Function, Replace Temp with Query, Decompose Conditional
- **Large Class** → Extract Class, Extract Subclass/Delegate, Move Function
- **Primitive Obsession** → Replace Primitive with Object, Introduce Parameter Object
- **Long Parameter List** → Introduce Parameter Object, Preserve Whole Object

## Couplers
- **Feature Envy** → Move Function, Extract Function then Move
- **Inappropriate Intimacy** → Move Function/Field, Hide Delegate, Replace Inheritance with Delegation
- **Message Chains** → Hide Delegate, Extract Function

## Change preventers
- **Divergent Change** → Split Phase, Extract Class
- **Shotgun Surgery** → Move Function/Field, Combine Functions into Class

## Dispensables
- **Duplicated Code** → Extract Function, Pull Up Method, Form Template Method
- **Dead Code** → Delete (with the safety net proving it is unreachable)
- **Speculative Generality** → Inline Function/Class, Collapse Hierarchy

## Conditionals
- **Complex Conditional** → Decompose Conditional, Replace Conditional with Polymorphism, Introduce Guard Clauses
- **Repeated Switch** → Replace Conditional with Polymorphism

> Rule: each move preserves behavior and is committed separately. Never combine a move with a
> behavior change. If a smell hides a bug, stop and route to the bug-hunter squad.
