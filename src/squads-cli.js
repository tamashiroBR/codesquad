import { createInterface } from 'node:readline';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { listInstalled, listAvailable, installSquad, removeSquad, getSquadMeta } from './squads.js';
import { loadLocale, t } from './i18n.js';
import { loadSavedLocale } from './init.js';
import { logEvent } from './logger.js';

async function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function squadsCli(subcommand, args, targetDir) {
  // Require an initialized project
  try {
    await stat(join(targetDir, '_codesquad'));
  } catch {
    await loadLocale('English');
    console.log(`\n  ${t('squadsNotInitialized')}\n`);
    return { success: false };
  }

  await loadSavedLocale(targetDir);

  try {
    if (subcommand === 'list' || !subcommand) {
      await runList(targetDir);
    } else if (subcommand === 'install') {
      if ((await runInstall(args[0], targetDir)) === false) return { success: false };
    } else if (subcommand === 'remove') {
      if ((await runRemove(args[0], targetDir)) === false) return { success: false };
    } else {
      console.log(`\n  ${t('squadsUnknownCommand', { cmd: subcommand })}\n`);
      return { success: false };
    }
  } catch (err) {
    console.log(`\n  ${t('squadsError', { message: err.message })}\n`);
    return { success: false };
  }

  return { success: true };
}

function printSquad(id, meta) {
  if (!meta) {
    console.log(`    ${id}`);
    return;
  }
  const head = [meta.icon, meta.name].filter(Boolean).join(' ');
  const desc = (meta.description || '').split('.')[0];
  console.log(`    ${head}  (${id}, ${meta.agentCount} ${t('squadsAgentsWord')}) — ${desc}`);
}

async function runList(targetDir) {
  console.log(`\n  Codesquad Squads\n`);

  const installed = await listInstalled(targetDir);
  const available = await listAvailable();

  console.log(`  ${t('squadsInstalledHeader')}`);
  if (installed.length > 0) {
    for (const id of installed) printSquad(id, await getSquadMeta(id));
  } else {
    console.log(`    ${t('squadsNoneInstalled')}`);
  }

  const notInstalled = available.filter((id) => !installed.includes(id));
  if (notInstalled.length > 0) {
    console.log(`\n  ${t('squadsAvailableHeader')}`);
    for (const id of notInstalled) printSquad(id, await getSquadMeta(id));
    console.log(`\n  ${t('squadsInstallHint')}`);
  }

  console.log('');
}

async function runInstall(id, targetDir) {
  if (!id) {
    console.log(`\n  ${t('squadsInstallUsage')}\n`);
    return false;
  }

  const installed = await listInstalled(targetDir);
  if (installed.includes(id)) {
    const answer = await confirm(`\n  ${t('squadsAlreadyInstalled', { id })}`);
    if (answer !== 'y' && answer !== 's') return false;
  }

  console.log(`\n  ${t('squadsInstalling', { id })}`);
  await installSquad(id, targetDir);
  console.log(`  ${t('squadsInstalled', { id })}\n`);
  await logEvent('squad:install', { name: id }, targetDir);
}

async function runRemove(id, targetDir) {
  if (!id) {
    console.log(`\n  ${t('squadsRemoveUsage')}\n`);
    return false;
  }

  const installed = await listInstalled(targetDir);
  if (!installed.includes(id)) {
    console.log(`\n  ${t('squadsNotInstalled', { id })}\n`);
    return;
  }

  const answer = await confirm(`\n  ${t('squadsConfirmRemove', { id })}`);
  if (answer !== 'y' && answer !== 's') return false;

  console.log(`\n  ${t('squadsRemoving', { id })}`);
  await removeSquad(id, targetDir);
  await logEvent('squad:remove', { name: id }, targetDir);
  console.log(`  ${t('squadsRemoved', { id })}\n`);
}
