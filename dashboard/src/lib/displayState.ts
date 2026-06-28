import type { SquadState, RunEvent, SquadInfo } from "@/types/state";
import { reconstructStateAt } from "@/lib/replay";

/**
 * Build an idle snapshot from a squad's definition (squad.yaml roster), so the
 * office shows each squad's REAL agents — correct count, role names, icons — even
 * before a run writes a live state.json. Without this the scene falls back to a
 * generic demo roster that's identical for every squad.
 */
export function buildIdleState(info: SquadInfo): SquadState {
  return {
    squad: info.code,
    status: "idle",
    step: { current: 0, total: 0, label: "" },
    agents: info.agents.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      gender: a.gender,
      status: "idle" as const,
      desk: { col: 1, row: 1 }, // renderScene auto-arranges identical desks into a grid
    })),
    handoff: null,
    startedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * The state the UI should currently render: the live snapshot, or — when the
 * replay scrubber is engaged — the historical frame reconstructed from events.
 * Shared by the Inspector (panels) and PhaserGame (office scene) so both always
 * agree on what's on screen.
 */
export function selectDisplayState(
  liveState: SquadState | undefined,
  events: RunEvent[] | undefined,
  replay: { active: boolean; t: number },
): SquadState | null {
  if (!liveState) return null;
  if (!replay.active || !events || events.length === 0) return liveState;
  return reconstructStateAt(liveState, events, replay.t);
}
