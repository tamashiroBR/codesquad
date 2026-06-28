---
task: "Reproduce"
order: 1
input: [bug_report: output/report.md, repo: branch/path do projeto]
output: [reproduction: output/reproduction.md]
---
# Reproduce
1. Ler o relato; extrair input, ambiente, esperado vs. real.
2. Reproduzir localmente. Reduzir ao menor input/passos que disparam o bug toda vez.
3. Se intermitente, torná-lo determinístico (seed/relógio/registro fixos).
4. Salvar `output/reproduction.md`: input mínimo · passos · esperado · real · confiabilidade (sempre/x de y).

## Quality Criteria
- [ ] Reprodução é mínima e confiável (idealmente 100%)
- [ ] Esperado e real declarados sem ambiguidade

## Veto Conditions
- Não reproduz → reportar e pedir mais dados ao usuário (não adivinhar a causa)
