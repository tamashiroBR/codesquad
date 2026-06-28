---
task: "Write Spec"
order: 1
input:
  - request: O pedido do usuário, ou uma issue lida via skill github (output/intake.md)
  - repo_context: repo-profile.md se houve investigação, senão repo-conventions.md
output:
  - spec: Spec com critérios de aceite testáveis, salva em output/spec.md
---

# Write Spec

Transforma o pedido em uma especificação acionável antes de qualquer linha de código.

## Process

1. **Reescrever o pedido em uma frase.** Se não conseguir, fazer UMA pergunta de esclarecimento e parar.
2. **Identificar atores e gatilho.** Quem faz isso e o que dispara.
3. **Escrever o happy path** como sequência numerada de passos observáveis.
4. **Enumerar edge cases e modos de falha** — vazio, máximo, nulo, não-autorizado, concorrente — com o comportamento esperado de cada.
5. **Escrever os critérios de aceite** como checklist, cada um verificável por um teste.
6. **Declarar o fora-de-escopo** explicitamente.
7. **Listar perguntas abertas que bloqueiam.** Não inventar respostas.
8. **Salvar `output/spec.md`.**

## Output Format

```markdown
# Spec — {feature}
## Summary
## Actors & Trigger
## Happy Path
## Edge Cases & Failure Modes
## Acceptance Criteria
- [ ] Given X, when Y, then Z
## Out of Scope
## Open Questions (blocking)
```

## Quality Criteria

- [ ] O pedido foi reescrito em uma frase
- [ ] Todo critério de aceite é testável (passa/falha)
- [ ] Pelo menos 3 edge cases/modos de falha com comportamento esperado
- [ ] Fora-de-escopo declarado
- [ ] Nenhuma decisão de implementação na spec

## Veto Conditions

Rejeitar e refazer se:
1. Algum critério não é testável — reescrever
2. A spec contém "como fazer" (escolha de lib, schema) — remover, é do Arquiteto
3. Comportamento de falha não especificado — adicionar
