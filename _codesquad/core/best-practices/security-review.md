---
id: security-review
name: "Security Review"
whenToUse: |
  Creating agents that review code/changes for security issues — injection, authn/authz,
  secrets handling, dependency risk — against a practical OWASP-style checklist.
  NOT for: implementing features, general code review, deployment.
version: "1.0.0"
---

# Security Review — Best Practices

## Core Principles

1. **Trust no input.** Every value crossing a boundary (request body, query param, header, file, env, third-party response) is hostile until validated. Validation is allow-list ("must match this shape"), not block-list ("must not contain these bad strings").

2. **Injection is a data/code confusion.** SQL, shell, template, and HTML injection all come from mixing untrusted data into a command/markup string. Use parameterized queries, argument arrays (not shell strings), and context-aware output encoding. Never build a query or command by concatenation.

3. **Authentication answers "who", authorization answers "may they".** They are separate checks. A logged-in user is not thereby allowed to read record #42. Verify ownership/permission on every access to a resource, server-side, every time — never rely on the UI hiding a button.

4. **Secrets never live in code or logs.** No API keys, tokens, or passwords in source, in commits, or in error messages. They come from the environment/secret store. Review diffs for accidentally committed secrets and for logging that prints tokens or PII.

5. **Fail closed, and don't leak.** On error, deny rather than allow. Error messages to the client are generic; the detail goes to server logs. A stack trace or SQL error returned to the user is both a leak and a reconnaissance gift.

## Practical Checklist (per change)

- [ ] All external inputs validated against an explicit schema
- [ ] Queries parameterized; no string-built SQL/shell/HTML
- [ ] Output encoded for its context (HTML/attr/URL/JSON)
- [ ] AuthN present where required; AuthZ checked per resource, server-side
- [ ] No secrets in code, config-in-repo, logs, or error responses
- [ ] Sensitive data not logged; PII handled per policy
- [ ] New/updated dependencies checked for known CVEs and necessity
- [ ] Rate limiting / abuse protection on expensive or auth endpoints
- [ ] Errors fail closed and reveal nothing internal to the client

## Verdict

Use the same severity model as code review. Any exploitable issue (injection, auth bypass, secret leak) is a **BLOCKER**. Defense-in-depth gaps with no direct exploit are **MAJOR**. State the concrete attack for each blocker — "an attacker who sends `'; DROP` in `name` ..." — not just "potential SQL injection".

## Anti-Patterns

- Block-list input filtering ("strip the word DROP")
- Authorization enforced only in the front end
- Verbose error messages / stack traces returned to clients
- Logging tokens, passwords, or full PII
- Adding a heavy dependency for a one-line need (supply-chain surface)
