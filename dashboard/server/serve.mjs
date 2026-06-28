#!/usr/bin/env node
// Standalone production server for the built dashboard.
//
// `npm run dev` gets the live WebSocket + file watcher from the Vite plugin.
// The *built* dashboard (`vite build` → dist/) is just static files, so serving
// it with a plain static server (e.g. `npx serve`) gives NO live updates —
// there is no /__squads_ws and no /api/snapshot, so the client silently falls
// back to polling a 404 and never connects. This server fixes that: it serves
// dist/ AND provides the same WebSocket/REST/watcher surface as the dev plugin,
// sharing the exact event-derivation logic via squadEvents.mjs.

import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer, WebSocket } from "ws";
import { watch as chokidarWatch } from "chokidar";
import { parse as parseYaml } from "yaml";
import { EventTracker } from "./squadEvents.mjs";

const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(SERVER_DIR, "../dist");
const PORT = Number(process.env.PORT) || 4173;

function resolveSquadsDir() {
  const candidates = [
    path.resolve(SERVER_DIR, "../../squads"), // dashboard/server -> project/squads
    path.resolve(process.cwd(), "../squads"),
    path.resolve(process.cwd(), "squads"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

// ── Squad + state reading (mirrors the dev plugin) ─────────────────────────

async function discoverSquads(squadsDir) {
  let entries;
  try {
    entries = await fsp.readdir(squadsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const squads = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const yamlPath = path.join(squadsDir, entry.name, "squad.yaml");
    try {
      const parsed = parseYaml(await fsp.readFile(yamlPath, "utf-8"));
      const s = parsed?.squad;
      if (s) {
        squads.push({
          code: typeof s.code === "string" ? s.code : entry.name,
          name: typeof s.name === "string" ? s.name : entry.name,
          description: typeof s.description === "string" ? s.description : "",
          icon: typeof s.icon === "string" ? s.icon : "\u{1F4CB}",
          agents: Array.isArray(s.agents) ? s.agents.filter((a) => typeof a === "string") : [],
        });
        continue;
      }
    } catch {
      // fall through to default
    }
    squads.push({ code: entry.name, name: entry.name, description: "", icon: "\u{1F4CB}", agents: [] });
  }
  return squads;
}

function isValidState(data) {
  if (!data || typeof data !== "object") return false;
  return typeof data.status === "string" && data.step != null && typeof data.step === "object" && Array.isArray(data.agents);
}

async function readActiveStates(squadsDir) {
  const states = {};
  let entries;
  try {
    entries = await fsp.readdir(squadsDir, { withFileTypes: true });
  } catch {
    return states;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const parsed = JSON.parse(await fsp.readFile(path.join(squadsDir, entry.name, "state.json"), "utf-8"));
      if (isValidState(parsed)) states[entry.name] = parsed;
    } catch {
      // skip
    }
  }
  return states;
}

async function buildSnapshot(squadsDir, tracker) {
  const activeStates = await readActiveStates(squadsDir);
  for (const [name, state] of Object.entries(activeStates)) tracker.record(name, state);
  return { type: "SNAPSHOT", squads: await discoverSquads(squadsDir), activeStates, events: tracker.all() };
}

function broadcast(wss, msg) {
  const data = JSON.stringify(msg);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      try { client.send(data); } catch { /* dying client */ }
    }
  }
}

// ── Static file serving (SPA) ──────────────────────────────────────────────

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.join(DIST_DIR, urlPath);
  // Prevent path traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const stat = await fsp.stat(filePath).catch(() => null);
    if (!stat || stat.isDirectory()) {
      filePath = path.join(DIST_DIR, "index.html"); // SPA fallback
    }
    const data = await fsp.readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not Found");
  }
}

// ── Wire up ────────────────────────────────────────────────────────────────

async function main() {
  const squadsDir = resolveSquadsDir();
  const tracker = new EventTracker();

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`\n  [serve] dist/ not found at ${DIST_DIR}\n  Run \`npm run build\` first.\n`);
    process.exit(1);
  }

  const server = http.createServer(async (req, res) => {
    if (req.url === "/api/snapshot") {
      try {
        const snap = await buildSnapshot(squadsDir, tracker);
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-cache" });
        res.end(JSON.stringify(snap));
      } catch {
        res.writeHead(500);
        res.end("Internal Server Error");
      }
      return;
    }
    serveStatic(req, res);
  });

  const wss = new WebSocketServer({ noServer: true });
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/__squads_ws") {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", async (ws) => {
    try {
      ws.send(JSON.stringify(await buildSnapshot(squadsDir, tracker)));
    } catch { /* closed early */ }
  });

  const watcher = chokidarWatch(squadsDir, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 50 },
    ignored: [/(^|[/\\])\./, /node_modules/, /output[/\\]/],
    depth: 2,
  });

  const onChange = (filePath) => {
    const parts = path.relative(squadsDir, filePath).replace(/\\/g, "/").split("/");
    if (parts.length < 2) return;
    const [squadName, fileName] = parts;
    if (fileName === "state.json") {
      fsp.readFile(filePath, "utf-8").then((raw) => {
        const parsed = JSON.parse(raw);
        if (!isValidState(parsed)) return;
        tracker.record(squadName, parsed);
        broadcast(wss, { type: "SQUAD_UPDATE", squad: squadName, state: parsed, events: tracker.get(squadName) });
      }).catch(() => {});
    } else if (fileName === "squad.yaml") {
      buildSnapshot(squadsDir, tracker).then((snap) => broadcast(wss, snap));
    }
  };

  const onRemove = (filePath) => {
    const parts = path.relative(squadsDir, filePath).replace(/\\/g, "/").split("/");
    if (parts.length < 2) return;
    const [squadName, fileName] = parts;
    if (fileName === "state.json") {
      tracker.clear(squadName);
      broadcast(wss, { type: "SQUAD_INACTIVE", squad: squadName });
    } else if (fileName === "squad.yaml") {
      buildSnapshot(squadsDir, tracker).then((snap) => broadcast(wss, snap));
    }
  };

  watcher.on("add", onChange).on("change", onChange).on("unlink", onRemove);

  server.listen(PORT, () => {
    console.log(`\n  codesquad dashboard (live)  →  http://localhost:${PORT}`);
    console.log(`  watching: ${squadsDir}\n`);
  });

  process.on("SIGINT", () => { watcher.close(); server.close(); process.exit(0); });
}

main();
