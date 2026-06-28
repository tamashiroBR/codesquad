import type { SquadState, RunEvent, AgentStatus, SquadStatus } from "@/types/state";

export function eventTime(e: RunEvent): number {
  return Date.parse(e.ts) || 0;
}

/** Sorted chronological copy. */
function chronological(events: RunEvent[]): RunEvent[] {
  return [...events].sort((a, b) => eventTime(a) - eventTime(b));
}

/** [start, end] epoch-ms domain of a run, from its events. */
export function runDomain(events: RunEvent[]): [number, number] {
  if (events.length === 0) {
    const now = Date.now();
    return [now - 1000, now];
  }
  const sorted = chronological(events);
  const start = eventTime(sorted[0]);
  const end = eventTime(sorted[sorted.length - 1]);
  return [start, Math.max(end, start + 1000)];
}

const EVENT_TO_STATUS: Partial<Record<RunEvent["type"], AgentStatus>> = {
  "agent-working": "working",
  "agent-delivering": "delivering",
  "agent-done": "done",
  "agent-checkpoint": "checkpoint",
  "agent-idle": "idle",
};

/**
 * Reconstruct the squad state as it was at epoch-ms time `t`, by replaying the
 * event stream up to `t` over the agent roster from `base`. Used by the replay
 * scrubber to feed a historical frame to the office scene.
 */
export function reconstructStateAt(base: SquadState, events: RunEvent[], t: number): SquadState {
  const agentStatus = new Map<string, AgentStatus>(base.agents.map((a) => [a.id, "idle"]));
  let step = { ...base.step };
  let squadStatus: SquadStatus = "idle";
  let handoff = null as SquadState["handoff"];

  for (const e of chronological(events)) {
    if (eventTime(e) > t) break;
    const mapped = EVENT_TO_STATUS[e.type];
    if (mapped && e.agentId) {
      agentStatus.set(e.agentId, mapped);
    }
    if (e.type === "run-started") {
      squadStatus = "running";
    } else if (e.type === "step-changed" && typeof e.step === "number") {
      step = { current: e.step, total: e.total ?? step.total, label: e.label ?? step.label };
    } else if (e.type === "handoff") {
      handoff = { from: e.from ?? "", to: e.to ?? "", message: e.message ?? "", completedAt: e.ts };
    } else if (e.type === "run-completed") {
      squadStatus = "completed";
    }
  }

  // Derive squad status: an outstanding checkpoint wins over running.
  const anyCheckpoint = [...agentStatus.values()].includes("checkpoint");
  if (squadStatus !== "completed") {
    squadStatus = anyCheckpoint ? "checkpoint" : squadStatus === "idle" ? "idle" : "running";
  }

  return {
    ...base,
    status: squadStatus,
    step,
    handoff,
    agents: base.agents.map((a) => ({ ...a, status: agentStatus.get(a.id) ?? a.status })),
    updatedAt: new Date(t).toISOString(),
  };
}

export interface Segment {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  start: number;
  end: number;
}

const ACTIVE_STATUSES: AgentStatus[] = ["working", "delivering", "checkpoint"];

/**
 * Build per-agent active segments (working/delivering/checkpoint spans) for the
 * timeline duration bars. Open segments are closed at `domainEnd`.
 */
export function computeSegments(
  base: SquadState,
  events: RunEvent[],
  domainEnd: number,
): Segment[] {
  const open = new Map<string, { status: AgentStatus; start: number; name: string }>();
  const segments: Segment[] = [];
  const nameById = new Map(base.agents.map((a) => [a.id, a.name]));

  const closeSegment = (agentId: string, end: number) => {
    const cur = open.get(agentId);
    if (!cur) return;
    segments.push({ agentId, agentName: cur.name, status: cur.status, start: cur.start, end });
    open.delete(agentId);
  };

  for (const e of chronological(events)) {
    const mapped = EVENT_TO_STATUS[e.type];
    if (!mapped || !e.agentId) continue;
    const at = eventTime(e);
    const name = e.agentName ?? nameById.get(e.agentId) ?? e.agentId;

    if (ACTIVE_STATUSES.includes(mapped)) {
      // Switching to a new active status: close the prior, open a new one
      closeSegment(e.agentId, at);
      open.set(e.agentId, { status: mapped, start: at, name });
    } else {
      // done / idle ends the current active span
      closeSegment(e.agentId, at);
    }
  }

  for (const agentId of [...open.keys()]) closeSegment(agentId, domainEnd);
  return segments;
}
