# Step 03 — Revisão Adversarial (reviewer)

The reviewer reads every hunk as an adversary of bugs, emits severity-tagged findings with
file:line and a suggested fix, runs a mandatory security pass, and checks test coverage of the
new behavior. Produces `output/findings.md`.
