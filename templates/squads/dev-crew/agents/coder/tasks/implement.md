---
task: "Implement"
order: 1
input:
  - spec: output/spec.md
  - design: output/design.md (aprovado)
  - conventions: pipeline/data/repo-conventions.md
output:
  - changeset: Mudanças no código, em um branch topic; resumo em output/implementation-notes.md
---

# Implement

Implementa exatamente o que a spec e o desenho aprovados pedem.

## Process

1. **Criar branch topic** (`feat/<slug>` ou `fix/<slug>`) — nunca commitar em main.
2. **Implementar contra os contratos do desenho.** Não redefinir escopo. Se o desenho não fecha, PARAR e reportar.
3. **Seguir as convenções reais do repo** (módulo, estilo de erro, nomes).
4. **Commits lógicos separados** — refactor antes da feature, cada um em seu commit (conventional commits).
5. **Não commitar segredo.** Conferir `git status` antes de stage.
6. **Salvar `output/implementation-notes.md`** com o que mudou e por quê (decisões pontuais), e a lista de arquivos tocados.

## Output Format

```markdown
# Implementation Notes — {feature}
## Branch
## Files changed
## Commits (conventional)
## Deviations from design (se houve — e por quê)
## Open concerns for the tester/reviewer
```

## Quality Criteria

- [ ] Branch topic criado; nada em main
- [ ] Só o escopo aprovado foi implementado
- [ ] Convenções do repo seguidas
- [ ] Commits lógicos separados, mensagens convencionais
- [ ] Nenhum segredo staged

## Veto Conditions

Parar e reportar (não improvisar) se:
1. O desenho aprovado se mostrou inviável — escalar, não inventar arquitetura nova
2. A spec exige algo fora do escopo aprovado
3. Seria necessário commitar um segredo ou desabilitar um teste para "passar"
