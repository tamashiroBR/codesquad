import type { SquadState, RunEvent } from "@/types/state";
import { reconstructStateAt } from "@/lib/replay";

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
