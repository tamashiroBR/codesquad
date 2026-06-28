#!/usr/bin/env node
// Seed the local runtime squads/ from the versioned templates/squads/ source.
//
// templates/squads/ is the single source of truth (version-controlled + shipped via
// the npm package + installed into user projects by `codesquad init`). squads/ is a
// disposable LOCAL runtime instance (gitignored). Run this to (re)populate it for
// dashboard work or local testing.
//
//   node scripts/seed-squads.mjs           # copy the squad definitions
//   node scripts/seed-squads.mjs --demos   # also activate *.demo.json as a live state.json
import { readdir, mkdir, cp, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "templates", "squads");
const DEST = join(ROOT, "squads");
const withDemos = process.argv.includes("--demos");

const entries = await readdir(SRC, { withFileTypes: true });
let count = 0;
for (const e of entries) {
  if (!e.isDirectory()) continue;
  const from = join(SRC, e.name);
  const to = join(DEST, e.name);
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
  let demoActive = false;
  if (withDemos) {
    const demo = join(to, "state.demo.json");
    if (existsSync(demo)) { await copyFile(demo, join(to, "state.json")); demoActive = true; }
  }
  count++;
  console.log(`  seeded squads/${e.name}${demoActive ? "  (demo active → state.json)" : ""}`);
}
console.log(`\n${count} squad(s) seeded into squads/ from templates/squads/.`);
