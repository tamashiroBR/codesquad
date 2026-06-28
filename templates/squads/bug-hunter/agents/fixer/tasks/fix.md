---
task: "Fix with Regression Test"
order: 2
input: [root_cause: output/root-cause.md, conventions: pipeline/data/repo-conventions.md]
output: [fix: changeset + output/fix-report.md (parcial)]
---
# Fix with Regression Test
1. Escrever PRIMEIRO o teste de regressão que codifica a reprodução. Rodá-lo; confirmar que FALHA no código atual pelo motivo certo.
2. Aplicar a MENOR mudança que corrige a causa raiz. Sem refactor não relacionado no mesmo commit.
3. Branch topic + conventional commit. Nada de segredo staged.
4. Registrar em `output/fix-report.md`: a mudança, o teste de regressão (file:line), e o resultado dos runs antigo/novo.

## Quality Criteria
- [ ] Teste de regressão falha no código antigo, passa no novo
- [ ] Fix é mínimo e na causa
- [ ] Sem refactor misturado

## Veto Conditions
- O teste passa mesmo sem o fix → ele não cobre o bug; reescrever
