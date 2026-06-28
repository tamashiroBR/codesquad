import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Built-in squads ship under templates/squads (versioned + published); init copies
// them into a project's squads/, and `squads install` adds them one at a time.
const BUNDLED_SQUADS_DIR = join(__dirname, '..', 'templates', 'squads');

const metaCache = new Map();

export async function listInstalled(targetDir) {
  try {
    const dir = join(targetDir, 'squads');
    const entries = await readdir(dir, { withFileTypes: true });
    const result = [];
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      try {
        await readFile(join(dir, e.name, 'squad.yaml'));
        result.push(e.name);
      } catch {
        // directory without a squad.yaml is not a squad
      }
    }
    return result;
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function listAvailable() {
  try {
    const entries = await readdir(BUNDLED_SQUADS_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

export async function getSquadMeta(id) {
  if (metaCache.has(id)) return metaCache.get(id);
  try {
    const raw = await readFile(join(BUNDLED_SQUADS_DIR, id, 'squad.yaml'), 'utf-8');
    const content = raw.replace(/\r\n/g, '\n');
    // squad.yaml is flat — top-level keys have no indentation.
    const name = content.match(/^name:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim() || id;
    const icon = content.match(/^icon:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim() || '';
    let description = '';
    const folded = content.match(/^description:\s*>\s*\n((?:\s{2,}.+\n?)+)/m);
    if (folded) {
      description = folded[1].replace(/\n\s*/g, ' ').trim();
    } else {
      description = content.match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim() || '';
    }
    const agentCount = (content.match(/^\s+- id:\s*[\w-]+/gm) || []).length;
    const result = { name, icon, description, agentCount };
    metaCache.set(id, result);
    return result;
  } catch (err) {
    if (err.code === 'ENOENT') {
      metaCache.set(id, null);
      return null;
    }
    throw err;
  }
}

function validateSquadId(id) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    throw new Error(`Invalid squad id: '${id}'`);
  }
}

export async function installSquad(id, targetDir) {
  validateSquadId(id);
  const src = join(BUNDLED_SQUADS_DIR, id);
  try {
    await readFile(join(src, 'squad.yaml'));
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error(`Squad '${id}' not found in registry`, { cause: err });
    throw err;
  }
  const dest = join(targetDir, 'squads', id);
  await mkdir(dest, { recursive: true });
  await cp(src, dest, { recursive: true });
  metaCache.delete(id);
}

export async function removeSquad(id, targetDir) {
  validateSquadId(id);
  await rm(join(targetDir, 'squads', id), { recursive: true, force: true });
  metaCache.delete(id);
}

export function clearMetaCache() {
  metaCache.clear();
}
