---
task: "Verify Fix"
order: 1
input: [fix: changeset, reproduction: output/reproduction.md]
output: [report: output/fix-report.md]
---
# Verify Fix
1. Rodar o teste de regressão no código ANTIGO (deve falhar) e no NOVO (deve passar) via run-tests.
2. Rodar a suíte INTEIRA — nenhuma regressão nova.
3. Confirmar que a reprodução original não reproduz mais.
4. Finalizar `output/fix-report.md` com os três resultados e o veredito FIXED/NOT-FIXED.

## Quality Criteria
- [ ] Teste de regressão: falha no antigo, passa no novo (gate regression-proves-fix)
- [ ] Suíte completa verde
- [ ] Reprodução original não reproduz mais

## Veto Conditions
- Regressão não falhava no código antigo → causa raiz errada, volta ao diagnóstico
