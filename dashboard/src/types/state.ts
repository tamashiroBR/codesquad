// state.json structure — matches Pipeline Runner output
export interface AgentDesk {
  col: number;
  row: number;
}

export type AgentStatus =
  | "idle"
  | "working"
  | "delivering"
  | "done"
  | "checkpoint";

export interface Agent {
  id: string;
  name: string;
  icon: string;
  status: AgentStatus;
  gender?: "male" | "female";
  desk: AgentDesk;
}

export interface Handoff {
  from: string;
  to: string;
  message: string;
  completedAt: string;
}

export type SquadStatus =
  | "idle"
  | "running"
  | "completed"
  | "checkpoint";

export interface SquadState {
  squad: string;
  status: SquadStatus;
  step: {
    current: number;
    total: number;
    label: string;
  };
  agents: Agent[];
  handoff: Handoff | null;
  startedAt: string | null;
  updatedAt: string;
}

// Squad metadata from squad.yaml
export interface SquadInfo {
  code: string;
  name: string;
  description: string;
  icon: string;
  agents: string[]; // agent file paths
}

// ── Run events ────────────────────────────────────────────────────────────
// state.json is a snapshot; the server derives a time-ordered event stream by
// diffing successive snapshots. Events power the timeline, duration bars, and
// replay scrubber on the client.
export type RunEventType =
  | "run-started"
  | "run-completed"
  | "step-changed"
  | "agent-working"
  | "agent-delivering"
  | "agent-done"
  | "agent-checkpoint"
  | "agent-idle"
  | "handoff";

export interface RunEvent {
  ts: string;          // ISO timestamp (taken from state.updatedAt, else server time)
  squad: string;
  type: RunEventType;
  agentId?: string;
  agentName?: string;
  from?: string;       // handoff source agent name
  to?: string;         // handoff target agent name
  message?: string;    // handoff message
  step?: number;       // step.current at the time of the event
  total?: number;      // step.total at the time of the event
  label?: string;      // step label
}

// WebSocket messages
export type WsMessage =
  | {
      type: "SNAPSHOT";
      squads: SquadInfo[];
      activeStates: Record<string, SquadState>;
      events?: Record<string, RunEvent[]>;
    }
  | { type: "SQUAD_UPDATE"; squad: string; state: SquadState; events?: RunEvent[] }
  | { type: "SQUAD_INACTIVE"; squad: string };
