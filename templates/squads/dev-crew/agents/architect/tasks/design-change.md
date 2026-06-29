---
task: "Design Change"
order: 1
input:
  - spec: output/spec.md (aprovada no checkpoint)
  - repo_conventions: pipeline/data/repo-conventions.md
output:
  - design: Desenho com módulos, contratos e ADR, salvo em output/design.md
---

# Design Change

Decide as fronteiras da mudança e registra o porquê — sem implementar.

## Process

1. **Reafirmar requisito + restrições** (stack existente, performance, prazo).
2. **Identificar entidades e operações** → viram os módulos.
3. **Definir a direção das dependências** entre módulos; checar que é acíclica.
4. **Definir os contratos em cada fronteira** (entrada, saída, erros) — é o que o coder vai preencher.
5. **Nomear o trade-off** e a alternativa rejeitada.
6. **Escrever o ADR** de cada decisão não-óbvia.
7. **Identificar a suposição mais arriscada** e como validá-la barato (spike/benchmark).
8. **Mapear o blast radius:** quem chama o que muda.
9. **Salvar `output/design.md`.**

## Output Format

```markdown
# Design — {feature}
## Modules & Responsibilities
## Dependency direction (acyclic)
## Interfaces (contracts)
## Decisions (ADR): chose / rejected / trade-off
## Blast radius
## Riskiest assumption + cheap validation
```

## Quality Criteria

- [ ] Direção de dependência explícita e sem ciclos
- [ ] Contratos definidos (entrada/saída/erros) por fronteira
- [ ] Cada decisão não-óbvia tem ADR
- [ ] Convenções do repo respeitadas (test runner, módulo, estilo)
- [ ] Suposição mais arriscada nomeada com plano de validação

## Veto Conditions

Rejeitar e refazer se:
1. Há dependência circular entre módulos
2. Abstração criada para um único chamador (YAGNI)
3. Propõe ferramentas que contrariam as convenções do repo
