---
task: "Diagnose Root Cause"
order: 1
input: [reproduction: output/reproduction.md]
output: [root_cause: output/root-cause.md]
---
# Diagnose Root Cause
1. A partir da reprodução, isolar por bisseção (commit/input/código). Cada passo corta o espaço de busca pela metade.
2. Achar a linha onde a realidade primeiro divergiu da intenção. Inspecionar valores REAIS, não supostos.
3. Enunciar a causa em UMA frase com file:line. Se não couber em uma frase, ainda não é a causa — continuar isolando.
4. Distinguir a causa dos sintomas downstream.
5. Salvar `output/root-cause.md`: causa (1 frase, file:line) · evidência · por que o sintoma parecia diferente.

## Quality Criteria
- [ ] Causa em uma frase com localização exata
- [ ] Baseada em valores reais inspecionados, não suposição

## Veto Conditions
- Causa vaga ou em múltiplas frases → continuar isolando
