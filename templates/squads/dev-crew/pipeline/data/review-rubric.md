# Review Rubric (severity model)

| Severity | Meaning | Effect on verdict |
|----------|---------|-------------------|
| BLOCKER | Incorrect behavior, data loss, security hole, or breaks build/tests | Must fix → REQUEST CHANGES |
| MAJOR | Works but fragile, untested edge case, or violates an established convention | REQUEST CHANGES if unaddressed |
| MINOR | Readability, naming, small redundancy | Non-blocking |
| NIT | Purely cosmetic | Never a reason to reject |

## Mechanical verdict rule

1. Any BLOCKER present → **REQUEST CHANGES**
2. No BLOCKER but unaddressed MAJOR → **REQUEST CHANGES**
3. Only MINOR / NIT → **APPROVE** (with comments)

State the rule applied in the verdict. Strengths never average away a BLOCKER.
