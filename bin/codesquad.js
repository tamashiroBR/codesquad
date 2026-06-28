#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { init } from '../src/init.js';
import { update } from '../src/update.js';
import { skillsCli } from '../src/skills-cli.js';
import { agentsCli } from '../src/agents-cli.js';
import { listRuns, printRuns } from '../src/runs.js';

const { positionals } = parseArgs({
  allowPositionals: true,
  strict: false,
});

const command = positionals[0];

if (command === 'init') {
  await init(process.cwd());
} else if (command === 'install') {
  // npx codesquad install <name>
  const result = await skillsCli('install', positionals.slice(1), process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'uninstall') {
  // npx codesquad uninstall <name>
  const result = await skillsCli('remove', positionals.slice(1), process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'update') {
  const target = positionals[1];
  if (target) {
    // npx codesquad update <name> → update specific skill
    const result = await skillsCli('update-one', [target], process.cwd());
    if (!result.success) process.exitCode = 1;
  } else {
    // npx codesquad update → update core
    const result = await update(process.cwd());
    if (!result.success) process.exitCode = 1;
  }
} else if (command === 'skills') {
  // Backward compat: npx codesquad skills list|install|remove|update
  const subcommand = positionals[1];
  const args = positionals.slice(2);
  const result = await skillsCli(subcommand, args, process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'agents') {
  const subcommand = positionals[1];
  const args = positionals.slice(2);
  const result = await agentsCli(subcommand, args, process.cwd());
  if (!result.success) process.exitCode = 1;
} else if (command === 'runs') {
  const squadName = positionals[1] || null;
  const runs = await listRuns(squadName, process.cwd());
  printRuns(runs);
} else {
  console.log(`
  codesquad — Multi-agent orchestration for Claude Code

  Usage:
    npx codesquad init                    Initialize Codesquad
    npx codesquad update                  Update Codesquad core
    npx codesquad install <name>          Install a skill
    npx codesquad uninstall <name>        Remove a skill
    npx codesquad update <name>           Update a specific skill
    npx codesquad skills                  List installed skills
    npx codesquad agents                  List installed agents
    npx codesquad agents install <name>   Install a predefined agent
    npx codesquad agents remove <name>    Remove an agent
    npx codesquad agents update           Update all agents
    npx codesquad runs [squad-name]     View execution history

  Learn more: https://github.com/tamashiroBR/codesquad
  `);
  if (command) process.exitCode = 1;
}
