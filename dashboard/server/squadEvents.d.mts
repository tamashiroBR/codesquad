import type { SquadState, RunEvent } from "../src/types/state";

export function diffStates(prev: SquadState | null, next: SquadState): RunEvent[];

export class EventTracker {
  prev: Map<string, SquadState>;
  log: Map<string, RunEvent[]>;
  record(squad: string, state: SquadState): RunEvent[];
  get(squad: string): RunEvent[];
  all(): Record<string, RunEvent[]>;
  clear(squad: string): void;
}
