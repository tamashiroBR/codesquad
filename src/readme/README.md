# Codesquad

Crie squads de agentes de IA que trabalham juntos — direto do seu IDE.

## Como Usar

Abra esta pasta no seu IDE e digite:

```
/codesquad
```

Isso abre o menu principal. De lá você pode criar squads, executá-los e mais.

Você também pode ser direto — descreva o que quer em linguagem natural:

```
/codesquad crie um squad para escrever posts no LinkedIn sobre IA
/codesquad execute o squad meu-squad
```

## Criar um Squad

Digite `/codesquad` e escolha "Criar squad" no menu, ou seja direto:

```
/codesquad crie um squad para [o que você precisa]
```

O Arquiteto fará algumas perguntas, projetará o squad e configurará tudo automaticamente.

## Executar um Squad

Digite `/codesquad` e escolha "Executar squad" no menu, ou seja direto:

```
/codesquad execute o squad <nome-do-squad>
```

O squad executa automaticamente, pausando apenas nos checkpoints de decisão.

## Escritório Virtual

O Escritório Virtual é uma interface visual 2D que mostra seus agentes trabalhando em tempo real.

**Passo 1 — Gere o dashboard** (no seu IDE):

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

---

# Codesquad (English)

Create AI squads that work together — right from your IDE.

## How to Use

Open this folder in your IDE and type:

```
/codesquad
```

This opens the main menu. From there you can create squads, run them, and more.

You can also be direct — describe what you want in plain language:

```
/codesquad create a squad for writing LinkedIn posts about AI
/codesquad run my-squad
```

## Create a Squad

Type `/codesquad` and choose "Create squad" from the menu, or be direct:

```
/codesquad create a squad for [what you need]
```

The Architect will ask a few questions, design the squad, and set everything up automatically.

## Run a Squad

Type `/codesquad` and choose "Run squad" from the menu, or be direct:

```
/codesquad run the <squad-name> squad
```

The squad runs automatically, pausing only at decision checkpoints.

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
