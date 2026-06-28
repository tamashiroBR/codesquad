// Shared, framework-agnostic event derivation.
//
// state.json is a *snapshot* (current statuses + current step). To drive a
// timeline, duration bars, and a replay scrubber, we need a *time series*.
// `diffStates` compares two consecutive snapshots and emits the discrete events
// that happened between them. It is pure (no I/O), so it runs identically inside
// the Vite dev plugin and the standalone production server, and is unit-testable.

/**
 * @typedef {import("../src/types/state").SquadState} SquadState
 * @typedef {import("../src/types/state").RunEvent} RunEvent
 * @typedef {import("../src/types/state").AgentStatus} AgentStatus
 */

/** @type {Record<string, RunEvent["type"]>} */
const STATUS_EVENT = {
  working: "agent-working",
  delivering: "agent-delivering",
  done: "agent-done",
  checkpoint: "agent-checkpoint",
  idle: "agent-idle",
};

/**
 * Derive the events that occurred between two snapshots of one squad.
 * Pass `prev = null` for the first observation (seeds run-started + initial
 * agent statuses so the timeline has a baseline).
 *
 * @param {SquadState | null} prev
 * @param {SquadState} next
 * @returns {RunEvent[]}
 */
export function diffStates(prev, next) {
  if (!next || !Array.isArray(next.agents)) return [];

  const ts = next.updatedAt || new Date().toISOString();
  const squad = next.squad;
  const step = next.step?.current;
  const total = next.step?.total;
  const label = next.step?.label;
  /** @type {RunEvent[]} */
  const events = [];

  const base = (extra) => ({ ts, squad, step, total, label, ...extra });

  // Run lifecycle
  if (!prev && (next.status === "running" || next.startedAt)) {
    events.push(base({ type: "run-started" }));
  }

  // Step change
  if (prev && prev.step?.current !== next.step?.current) {
    events.push(base({ type: "step-changed" }));
  }

  // Agent status transitions
  const prevById = new Map((prev?.agents ?? []).map((a) => [a.id, a]));
  for (const agent of next.agents) {
    const before = prevById.get(agent.id);
    const changed = !before || before.status !== agent.status;
    if (!changed) continue;
    const type = STATUS_EVENT[agent.status];
    // On first observation only surface meaningful (non-idle) states to avoid noise.
    if (!type) continue;
    if (!prev && agent.status === "idle") continue;
    events.push(base({ type, agentId: agent.id, agentName: agent.name }));
  }

  // Handoff (new completedAt)
  if (next.handoff) {
    const isNew = !prev?.handoff || prev.handoff.completedAt !== next.handoff.completedAt;
    if (isNew) {
      events.push(
        base({
          type: "handoff",
          from: next.handoff.from,
          to: next.handoff.to,
          message: next.handoff.message,
          ts: next.handoff.completedAt || ts,
        }),
      );
    }
  }

  // Completion
  if (next.status === "completed" && prev?.status !== "completed") {
    events.push(base({ type: "run-completed" }));
  }

  return events;
}

/**
 * Stateful per-squad event accumulator. Keeps the previous snapshot in memory
 * and appends derived events. No disk I/O — events live for the server session.
 */
export class EventTracker {
  constructor() {
    /** @type {Map<string, SquadState>} */
    this.prev = new Map();
    /** @type {Map<string, RunEvent[]>} */
    this.log = new Map();
  }

  /**
   * Record a new snapshot for a squad and return only the newly derived events.
   * @param {string} squad
   * @param {SquadState} state
   * @returns {RunEvent[]}
   */
  record(squad, state) {
    const prev = this.prev.get(squad) ?? null;
    const events = diffStates(prev, state);
    this.prev.set(squad, state);
    if (events.length) {
      const arr = this.log.get(squad) ?? [];
      arr.push(...events);
      this.log.set(squad, arr);
    }
    return events;
  }

  /** @param {string} squad @returns {RunEvent[]} */
  get(squad) {
    return this.log.get(squad) ?? [];
  }

  /** @returns {Record<string, RunEvent[]>} */
  all() {
    return Object.fromEntries(this.log);
  }

  /** @param {string} squad */
  clear(squad) {
    this.prev.delete(squad);
    this.log.delete(squad);
  }
}
