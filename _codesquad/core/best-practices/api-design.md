---
id: api-design
name: "API & Interface Design"
whenToUse: |
  Creating agents that design HTTP/RPC APIs, library interfaces, or data contracts —
  resource modeling, versioning, error semantics, backward compatibility.
  NOT for: implementing the handlers, reviewing diffs, deployment.
version: "1.0.0"
---

# API & Interface Design — Best Practices

## Core Principles

1. **The contract is the product.** Consumers depend on the shape of requests, responses, and errors — not on the implementation. Design the contract deliberately; the implementation can change freely behind it.

2. **Model resources and verbs honestly.** Nouns are resources, HTTP methods are the verbs. `POST /orders` creates, `GET /orders/{id}` reads. Do not tunnel everything through `POST /do` with an action field unless the domain genuinely is RPC.

3. **Errors are part of the contract.** Define the error shape once (a stable code, a human message, optional details) and use it everywhere. A 200 with `{"error": ...}` in the body is a broken contract. Use the status code that matches the failure (400 client, 401/403 auth, 404 missing, 409 conflict, 422 validation, 5xx server).

4. **Design for change: version and stay backward-compatible.** Additive changes (new optional field) are safe; removing or renaming a field is breaking. Plan a versioning strategy before v1 ships, and never break a published contract without a version bump and a deprecation window.

5. **Be strict in what you return, lenient in what you accept — within reason.** Validate inputs explicitly and reject malformed requests with a clear 4xx. Return only documented fields. Undocumented fields become accidental contract.

## Checklist

- [ ] Each endpoint has a documented request schema, response schema, and error cases
- [ ] Status codes match the semantics of each outcome
- [ ] Pagination, filtering, and sorting are consistent across collection endpoints
- [ ] Idempotency is defined for retried writes where it matters
- [ ] Auth requirements stated per endpoint
- [ ] Versioning strategy chosen; breaking changes gated behind a version
- [ ] Examples provided for the happy path and at least one error

## Anti-Patterns

- 200 OK wrapping an error body
- `POST /api?action=delete` instead of proper methods
- Returning internal DB column names / leaking internal structure
- Breaking a published field without a version bump
- Inconsistent error shapes across endpoints
