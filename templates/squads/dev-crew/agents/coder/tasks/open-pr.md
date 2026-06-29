---
task: "Open PR"
order: 2
input:
  - approved: Aprovação humana no checkpoint step-09
  - artifacts: output/spec.md, output/design.md, output/verification-report.md, output/review.md
output:
  - pr: Pull request aberto via skill github; resumo em output/pr-summary.md
---

# Open PR

Abre o pull request — somente após aprovação humana explícita.

## Process

1. **Confirmar o gate:** review = APPROVE e checkpoint step-09 aprovado pelo usuário. Sem isso, NÃO abrir.
2. **Montar o corpo do PR** a partir dos artefatos: resumo da spec, decisões do design (ADR), tabela de verificação, e o veredito da revisão.
3. **Abrir o PR via github** a partir do branch topic para o branch padrão.
4. **Salvar `output/pr-summary.md`** com link, título e checklist do Definition of Done.

## Output Format

```markdown
# PR Summary — {feature}
## Title (conventional)
## Link
## Body sections: Spec · Design · Verification · Review
## Definition of Done checklist
```

## Quality Criteria

- [ ] PR só aberto após APPROVE + aprovação do checkpoint
- [ ] Corpo referencia spec, design, verificação e revisão
- [ ] Título em conventional commit
- [ ] Definition of Done preenchido

## Veto Conditions

NÃO abrir o PR se:
1. O veredito da revisão é REQUEST CHANGES
2. A suíte não está verde
3. O usuário não aprovou o checkpoint step-09
