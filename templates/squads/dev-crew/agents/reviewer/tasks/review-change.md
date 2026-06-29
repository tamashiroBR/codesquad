---
task: "Review Change"
order: 1
input:
  - spec: output/spec.md
  - design: output/design.md
  - changeset: O diff do branch topic
  - report: output/verification-report.md
output:
  - review: output/review.md com veredito mecânico
---

# Review Change

Lê o diff como adversário dos bugs. Não confia no coder por construção.

## Process

1. **Carregar spec + critérios.** Saber o que é "correto" antes de ler o diff.
2. **1ª passada — correção:** o diff implementa a spec? Andar o happy path com valores reais.
3. **2ª passada — adversarial:** para cada entrada (vazio, máximo, negativo, nulo, não-autorizado, concorrente), onde quebra?
4. **3ª passada — testes:** cada comportamento novo e cada edge case têm teste que falharia sem a mudança? A suíte realmente roda no CI?
5. **4ª passada — convenções, segurança e blast radius:** lint/types, callers afetados, injeção/authz/segredo (security-review).
6. **Compilar findings** com severidade + file:line + correção concreta.
7. **Emitir veredito por regra mecânica** e salvar `output/review.md`.

## Output Format

```markdown
# Review — {change}
**Verdict: APPROVE | REQUEST CHANGES** (regra aplicada)
## Blockers (file:line + fix)
## Major
## Minor / Nits
## What's good
```

## Quality Criteria

- [ ] Veredito segue a regra mecânica (qualquer BLOCKER → REQUEST CHANGES)
- [ ] Toda finding tem file:line e correção sugerida
- [ ] Edge cases foram andados, não só o happy path
- [ ] Cobertura de teste do comportamento novo foi verificada
- [ ] Checagens de segurança aplicadas

## Veto Conditions

Refazer a própria revisão se:
1. Há finding sem local ou sem correção
2. O veredito não bate com a regra mecânica
3. A revisão aprovou sem andar nenhum edge case
