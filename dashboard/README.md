# codesquad — Virtual Office Dashboard

A 2D virtual office (Vite + React + Phaser) that visualizes squads running in
your IDE. It watches each `squads/<name>/state.json` and updates **live** as the
pipeline runner writes progress, with a timeline, replay scrubber, and
checkpoint panel.

## Running

### Dev (live, hot reload)

```bash
cd dashboard
npm install      # first time only
npm run dev      # http://localhost:5173
```

### Production (built, still live)

```bash
cd dashboard
npm run build
npm run serve    # http://localhost:4173  (set PORT to override)
```

> **Why not `npx serve dist`?** The live channel (WebSocket `/__squads_ws` +
> file watcher + `/api/snapshot`) is provided by the dev Vite plugin and, for
> the build, by `server/serve.mjs`. A plain static server has none of these, so
> the client would silently fall back to polling a 404 and never update.
> `npm run serve` serves the build *with* the live channel.

## How live updates work

```
squads/<name>/state.json  ──(write by runner)──►  file watcher (chokidar)
        │                                                  │
        │                                          diff vs previous snapshot
        │                                          (server/squadEvents.mjs)
        ▼                                                  ▼
   /api/snapshot  ◄── REST fallback           WebSocket broadcast (state + events)
                                                           │
                                                           ▼
                                          useSquadSocket → zustand store → UI + Phaser
```

`state.json` is a **snapshot** (current statuses + step). The server derives a
time-ordered **event stream** by diffing successive snapshots
(`diffStates` in `server/squadEvents.mjs`, shared by the dev plugin and
`serve.mjs`). Those events power:

- **Timeline** — per-agent duration bars (working / delivering / checkpoint) plus
  event markers (handoffs, step changes, completion).
- **Replay** — the scrubber reconstructs any past frame from the event stream
  (`src/lib/replay.ts`) and feeds it to the office scene; toggle LIVE ⇄ REPLAY.
- **Checkpoint panel** — surfaces a pending approval (which step, which agents,
  how long). Read-only: approval happens in your IDE, where the squad runs.

Events live in memory for the server session (no files written into your repo).

## Layout

- `src/office/` — Phaser scene, room builder, agent sprites (HiDPI-aware,
  active-agent glow).
- `src/components/` — sidebar, status bar, and the Inspector (timeline, replay,
  checkpoint).
- `src/plugin/squadWatcher.ts` — Vite dev-server live channel.
- `server/serve.mjs` — standalone live server for the production build.
- `server/squadEvents.mjs` — shared, pure event-derivation logic
  (`npm run test:events` runs its smoke test).

## State schema (`squads/<name>/state.json`)

```jsonc
{
  "squad": "feature-builder",
  "status": "running",          // idle | running | completed | checkpoint
  "step": { "current": 2, "total": 5, "label": "implement" },
  "agents": [
    { "id": "coder", "name": "Caio", "status": "working", "desk": { "col": 1, "row": 1 } }
    // status: idle | working | delivering | done | checkpoint
  ],
  "handoff": { "from": "Arq", "to": "Caio", "message": "design ok", "completedAt": "..." },
  "startedAt": "...",
  "updatedAt": "..."
}
```
