# Squad Anti-Patterns (the whole pipeline guards against these)

- **Scope creep** — implementing beyond the approved spec ("while I'm here…").
- **Symptom fixing** — making a bug's symptom disappear instead of fixing the cause.
- **False green** — editing a test to pass instead of fixing the code.
- **Big-bang commits** — one giant uncheckpointed change no one can review or revert.
- **Trusting the coder** — a review that shares the implementer's assumptions catches nothing.
- **Generic conventions** — proposing Jest/CommonJS when the repo uses Vitest/ESM.
- **Autonomous push** — pushing or opening a PR without the human checkpoint.
- **Premature abstraction** — building a framework for a single caller.
