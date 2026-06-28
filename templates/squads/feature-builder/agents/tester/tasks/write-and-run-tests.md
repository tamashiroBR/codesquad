---
task: "Write and Run Tests"
order: 1
input:
  - spec: output/spec.md (critérios de aceite)
  - changeset: A implementação do coder (branch topic)
  - conventions: pipeline/data/repo-conventions.md (framework de teste real)
output:
  - report: output/verification-report.md + testes adicionados ao repo
---

# Write and Run Tests

Prova ou refuta que a implementação atende cada critério de aceite.

## Process

1. **Mapear critérios → casos.** Cada critério de aceite vira ≥1 teste. Adicionar os edge cases nomeados na spec.
2. **Escrever no framework REAL do projeto** (Vitest/Jest/pytest/go test — de repo-conventions.md), no local e nomenclatura existentes.
3. **Ver o teste falhar pelo motivo certo** antes de confiar no verde (quando aplicável).
4. **Rodar a suíte com a skill run-tests.** Registrar o comando exato e o resultado.
5. **Preencher a tabela** critério→teste→nível→status e listar lacunas.
6. **Se vermelho:** listar as falhas com mensagem — isso aciona o gate `green-suite` e devolve ao coder.
7. **Salvar `output/verification-report.md`.**

## Output Format

```markdown
# Verification — {feature}
## Cases covered
| Criterion | Test | Level | Status |
## Gaps
## Command
`<comando real>` — N passed, M failed, K skipped
## Verdict: GREEN | RED
```

## Quality Criteria

- [ ] Todo critério de aceite mapeado para ≥1 teste
- [ ] Edge cases da spec cobertos, não só o happy path
- [ ] Testes no framework e local reais do projeto
- [ ] Comando real registrado e executado via run-tests
- [ ] Determinísticos (sem tempo/rede reais)

## Veto Conditions

Marcar RED (volta ao coder) se:
1. Qualquer teste falha
2. Um critério de aceite não tem teste
3. Um teste passa independentemente de o código estar certo (não pode falhar)
