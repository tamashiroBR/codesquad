# codesquad

Crie squads de agentes de IA que entregam software juntos — direto da sua IDE.

codesquad é um framework de orquestração multi-agente focado em **desenvolvimento de software**. Descreva o que você precisa em linguagem natural, e o codesquad monta uma equipe de agentes especializados — spec, arquitetura, código, teste, revisão — que trabalham em pipeline com checkpoints humanos.

> **Sobre esta versão:** fork focado em engenharia de software, derivado do [opensquad](https://github.com/renatoasse/opensquad) de Renato Asse. O motor de orquestração é o mesmo; o que muda é o foco — best practices, skills e squads inclusos são todos de desenvolvimento de software.

## O que é um Squad?

Um squad é uma equipe de agentes de IA que colaboram em uma tarefa. Cada agente tem um papel específico e uma única responsabilidade. Eles executam em pipeline com checkpoints onde o agente pausa e pede sua aprovação antes de continuar. Os checkpoints são instruções no pipeline — o enforcement real de permissões depende da IDE host (ex: Claude Code, Cursor).

Exemplo (o squad **feature-builder**):

- **Spec-writer** transforma o pedido ou a issue numa especificação com critérios de aceite
- **Architect** desenha a mudança (módulos, contratos, ADR) antes de uma linha de código
- **Coder** implementa exatamente o escopo aprovado, em commits lógicos
- **Tester** escreve e roda os testes — a suíte verde é um gate obrigatório
- **Reviewer** revisa o diff de forma adversarial antes de liberar o PR

## Squads inclusos

| Squad | Faz | Pipeline | Gate mecânico |
|-------|-----|----------|---------------|
| 🛠️ **feature-builder** | Pedido/issue → mudança implementada, testada, revisada e em PR | spec → design → implement → verify → review → PR | Suíte verde antes da revisão; só APPROVE habilita o PR |
| 🐞 **bug-hunter** | Relato de bug → fix verificado com teste de regressão | reproduzir → diagnosticar causa raiz → fix + teste → verificar | O teste de regressão precisa falhar no código antigo e passar no novo |
| 🧹 **refactor** | Melhora a estrutura sem mudar o comportamento | alvo → rede de segurança → plano → passos pequenos → verificar | Rede de segurança verde antes; comportamento preservado depois |
| 🔍 **pr-review** | Revisa um PR de terceiro e posta um veredito estruturado | contexto → revisão adversarial → veredito → (checkpoint) → postar | Regra de severidade: qualquer BLOCKER → REQUEST CHANGES |

Cada squad já vem com agentes, pipeline, gates e arquivos de dados (convenções do repo, rubrica de revisão, catálogo de refactor). Use como estão ou edite com `/codesquad edit <nome>`.

## Para quem?

Para quem escreve, mantém ou revisa software e quer automatizar o trabalho repetitivo de engenharia com agentes — sem abrir mão do controle humano nos pontos que importam.

- **Devs individuais** — transforme uma issue em PR pronto, cace bugs com teste de regressão, refatore com rede de segurança
- **Times de engenharia** — pipelines reutilizáveis com checkpoints e gates que impõem testes verdes e revisão antes do merge
- **Tech leads / mantenedores** — revisão adversarial padronizada de PRs (inclusive de dependabot e contribuidores externos)
- **Times de plataforma/DevOps** — squads para auditar CI/CD, revisar segurança e documentar runbooks e ADRs

## O que dá pra fazer?

- **Entregar uma feature** — da spec ao PR, com testes e revisão adversarial no caminho
- **Caçar um bug** — reproduzir, achar a causa raiz (não o sintoma) e corrigir com teste de regressão
- **Refatorar com segurança** — testes de caracterização primeiro, depois passos pequenos e reversíveis, comportamento preservado
- **Revisar PRs** — findings por severidade com file:line, passada de segurança e veredito por regra mecânica
- **Projetar APIs e arquitetura** — modelagem de recursos, versionamento, ADRs antes da implementação
- **Revisão de segurança** — checklist estilo OWASP sobre o diff (injeção, authz, segredos, dependências)
- **Documentação técnica** — READMEs, docs de API, runbooks, guias de migração, changelogs
- E muito mais — qualquer fluxo de engenharia que envolva especificar, construir, verificar ou revisar

## Instalação

**Pré-requisito:** Node.js 20+

```bash
npx codesquad init
```

> **Nota:** rode sua IDE de IA de dentro do diretório do projeto onde você executou `npx codesquad init`. O comando `/codesquad` só fica disponível quando a IDE é aberta nessa pasta.

Para atualizar uma instalação existente:

```bash
npx codesquad update
```

## IDEs Suportadas

| IDE | Status |
|-----|--------|
| Claude Code | Disponível |
| Cursor | Disponível |
| VS Code + Copilot | Disponível |
| Codex (OpenAI) | Disponível |
| Open Code | Disponível |
| Antigravity | Disponível |
| Gemini CLI | Disponível |
| Qwen Code | Disponível |
| Trae | Disponível |

## Escritório Virtual

O Escritório Virtual é uma interface visual 2D que mostra seus agentes trabalhando em tempo real.

**Passo 1 — Gere o dashboard** (na sua IDE):

```
/codesquad dashboard
```

**Passo 2 — Rode o dashboard ao vivo** (no terminal, dentro do projeto):

```bash
cd dashboard
npm run dev
```

Abra o endereço mostrado (padrão `http://localhost:5173`). O dashboard observa os `state.json` dos squads e atualiza **ao vivo** enquanto eles trabalham — com linha do tempo, replay e painel de checkpoint.

**Modo produção (build + servidor ao vivo):**

```bash
cd dashboard
npm run build
npm run serve   # http://localhost:4173
```

> Use `npm run serve`, não um servidor estático comum: o build sozinho (ex.: `npx serve`) **não** recebe atualizações ao vivo, pois não expõe o WebSocket nem o watcher de arquivos.

## Criando seu Squad

Abra o menu:

```
/codesquad
```

Para criar um novo squad, selecione a opção e o **Arquiteto** faz algumas perguntas, projeta o squad e configura tudo automaticamente. Você aprova o design antes de qualquer execução.

## Executando um Squad

```
/codesquad rode o squad <nome-do-squad>
```

O squad executa automaticamente, pausando nos checkpoints onde o agente pede sua aprovação.

## Exemplos

```
/codesquad
/codesquad rode o squad feature-builder
/codesquad rode o squad bug-hunter
/codesquad crie um Squad que audita um pipeline de CI e propõe gates de qualidade
/codesquad crie um Squad que projeta uma API REST a partir de um documento de requisitos
/codesquad crie um Squad que gera testes de caracterização para um módulo legado sem cobertura
```

## Comandos

| Comando | O que faz |
|---------|-----------|
| `/codesquad` | Abre o menu principal |
| `/codesquad help` | Mostra todos os comandos |
| `/codesquad create` | Cria um novo squad |
| `/codesquad run <nome>` | Executa um squad |
| `/codesquad list` | Lista seus squads |
| `/codesquad edit <nome>` | Modifica um squad |
| `/codesquad skills` | Navega pelas skills instaladas |
| `/codesquad install <nome>` | Instala uma skill do catálogo |
| `/codesquad uninstall <nome>` | Remove uma skill instalada |

## Custo de Tokens

O codesquad é open source e gratuito como software. É possível usá-lo de forma 100% gratuita com stacks como Google Antigravity (free tier com Gemini) ou OpenCode com LLMs locais (Ollama, LM Studio, etc.).

Stacks como Claude Code (Claude Pro/Max) e API da OpenAI consomem tokens pagos:

- Cada execução de squad consome tokens — a quantidade depende do número de agentes, da complexidade do pipeline e do modelo escolhido.
- Investigação de codebase (mapear convenções do repo antes do primeiro run) e suítes de teste grandes são operações mais intensivas.
- O framework carrega prompts de sistema, best practices e instruções de agentes no contexto — o que contribui para o consumo base de cada execução.

Se estiver usando uma stack paga, recomendamos monitorar seu consumo na sua IDE ou no dashboard do provedor de IA.

## Investigação de Codebase e Privacidade

Antes do primeiro run, um squad pode rodar uma investigação opcional do repositório-alvo para que os agentes sigam as convenções reais do projeto (módulo ESM/CJS, estilo de erro, comandos de teste) em vez de defaults genéricos.

- **Escopo local:** a investigação lê o código do repositório que você apontar (caminho local ou git URL).
- **Sem segredos no contexto:** os agentes não devem ler nem commitar `.env`, segredos ou saída de build — isso está nas convenções e nos anti-patterns de cada squad.
- **Artefatos versionados com cuidado:** memória e investigações ficam em `_codesquad/` e respeitam o `.gitignore` do projeto.

## Sobre

Fork focado em desenvolvimento de software do [opensquad](https://github.com/renatoasse/opensquad), projeto open source criado por [Renato Asse](https://github.com/renatoasse). O motor de orquestração multi-agente é mantido; o foco foi reorientado para engenharia — best practices, skills e squads inclusos são de desenvolvimento de software.

Contribuições são bem-vindas. Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para saber como participar.

## Licença

MIT — use como quiser.

---

# codesquad (English)

Create AI squads that ship software together — right from your IDE.

codesquad is a multi-agent orchestration framework focused on **software development**. Describe what you need in plain language, and codesquad assembles a team of specialized agents — spec, architecture, code, test, review — that run in a pipeline with human checkpoints.

> **About this version:** a software-engineering-focused fork derived from Renato Asse's [opensquad](https://github.com/renatoasse/opensquad). The orchestration engine is the same; the focus is what changed — the bundled best practices, skills, and squads are all software development.

## What is a Squad?

A squad is a team of AI agents that collaborate on a task. Each agent has one clear responsibility. They run in a pipeline with checkpoints where the agent pauses and asks for your approval before continuing. Checkpoints are instructions in the pipeline — actual permission enforcement depends on the host IDE (e.g., Claude Code, Cursor).

Example (the **feature-builder** squad):

- **Spec-writer** turns the request or issue into a spec with acceptance criteria
- **Architect** designs the change (modules, contracts, ADR) before any code
- **Coder** implements exactly the approved scope, in logical commits
- **Tester** writes and runs the tests — a green suite is a hard gate
- **Reviewer** reviews the diff adversarially before a PR is allowed

## Built-in squads

| Squad | Does | Pipeline | Mechanical gate |
|-------|------|----------|-----------------|
| 🛠️ **feature-builder** | Request/issue → implemented, tested, reviewed change in a PR | spec → design → implement → verify → review → PR | Green suite before review; only APPROVE unlocks the PR |
| 🐞 **bug-hunter** | Bug report → verified fix with a regression test | reproduce → root cause → fix + test → verify | The regression test must fail on the old code and pass on the new |
| 🧹 **refactor** | Improves structure without changing behavior | target → safety net → plan → small steps → verify | Safety net green first; behavior preserved after |
| 🔍 **pr-review** | Reviews someone's PR and posts a structured verdict | context → adversarial review → verdict → (checkpoint) → post | Severity rule: any BLOCKER → REQUEST CHANGES |

Each squad ships with agents, pipeline, gates, and data files (repo conventions, review rubric, refactor catalog). Use them as-is or edit with `/codesquad edit <name>`.

## Who is it for?

For people who write, maintain, or review software and want to automate the repetitive parts of engineering with agents — without giving up human control at the points that matter.

- **Individual devs** — turn an issue into a ready PR, hunt bugs with a regression test, refactor with a safety net
- **Engineering teams** — reusable pipelines with checkpoints and gates that enforce green tests and review before merge
- **Tech leads / maintainers** — standardized adversarial PR review (including dependabot and outside contributors)
- **Platform/DevOps teams** — squads to audit CI/CD, review security, and document runbooks and ADRs

## Installation

**Prerequisite:** Node.js 20+

```bash
npx codesquad init
```

> **Note:** Always run your AI IDE from inside the project directory where you ran `npx codesquad init`. The `/codesquad` command is only available when the IDE is opened in that folder.

To update an existing installation:

```bash
npx codesquad update
```

## Supported IDEs

| IDE | Status |
|-----|--------|
| Claude Code | Available |
| Cursor | Available |
| VS Code + Copilot | Available |
| Codex (OpenAI) | Available |
| Open Code | Available |
| Antigravity | Available |
| Gemini CLI | Available |
| Qwen Code | Available |
| Trae | Available |

## Virtual Office

The Virtual Office is a 2D visual interface that shows your agents working in real time.

**Step 1 — Generate the dashboard** (in your IDE):

```
/codesquad dashboard
```

**Step 2 — Run the dashboard live** (in terminal, inside the project):

```bash
cd dashboard
npm run dev
```

Open the address shown (default `http://localhost:5173`). The dashboard watches each squad's `state.json` and updates **live** as they work — with a timeline, replay, and checkpoint panel.

**Production mode (build + live server):**

```bash
cd dashboard
npm run build
npm run serve   # http://localhost:4173
```

> Use `npm run serve`, not a plain static server: the build alone (e.g. `npx serve`) gets **no** live updates, since it exposes neither the WebSocket nor the file watcher.

## Creating your Squad

Describe what you need:

```
/codesquad create "A squad that designs a REST API from a requirements doc"
```

The **Architect** asks a few questions, designs the squad, and sets everything up automatically. You approve the design before any execution begins.

## Running a Squad

```
/codesquad run <squad-name>
```

The squad runs automatically, pausing at checkpoints where the agent asks for your approval.

## Examples

```
/codesquad run feature-builder
/codesquad run bug-hunter
/codesquad create "Squad that audits a CI pipeline and proposes quality gates"
/codesquad create "Squad that designs a REST API from a requirements document"
/codesquad create "Squad that generates characterization tests for an uncovered legacy module"
```

## Commands

| Command | What it does |
|---------|-------------|
| `/codesquad` | Open the main menu |
| `/codesquad help` | Show all commands |
| `/codesquad create` | Create a new squad |
| `/codesquad run <name>` | Run a squad |
| `/codesquad list` | See all your squads |
| `/codesquad edit <name>` | Modify a squad |
| `/codesquad skills` | Browse installed skills |
| `/codesquad install <name>` | Install a skill from catalog |
| `/codesquad uninstall <name>` | Remove an installed skill |

## Token Cost

codesquad is open source and free as software. You can use it completely free with stacks like Google Antigravity (free tier with Gemini) or OpenCode with local LLMs (Ollama, LM Studio, etc.).

Stacks like Claude Code (Claude Pro/Max) and OpenAI API consume paid tokens:

- Every squad run consumes tokens — the amount depends on the number of agents, pipeline complexity, and the model chosen.
- Codebase investigation (mapping repo conventions before the first run) and large test suites are the more intensive operations.
- The framework loads system prompts, best practices, and agent instructions into context — contributing to the base token consumption of every run.

If using a paid stack, we recommend monitoring your usage in your IDE or your AI provider's dashboard.

## Codebase Investigation & Privacy

Before the first run, a squad can run an optional investigation of the target repository so agents follow the project's real conventions (ESM/CJS module system, error style, test commands) instead of generic defaults.

- **Local scope:** the investigation reads the code of the repo you point it at (local path or git URL).
- **No secrets in context:** agents must not read or commit `.env`, secrets, or build output — this is encoded in each squad's conventions and anti-patterns.
- **Carefully versioned artifacts:** memory and investigations live under `_codesquad/` and respect the project's `.gitignore`.

## About

A software-development-focused fork of [opensquad](https://github.com/renatoasse/opensquad), an open source project created by [Renato Asse](https://github.com/renatoasse). The multi-agent orchestration engine is preserved; the focus was reoriented toward engineering — the bundled best practices, skills, and squads are all software development.

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to participate.

## License

MIT — use it however you want.
