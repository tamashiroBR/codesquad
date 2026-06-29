import { create } from "zustand";
import type { SquadInfo, SquadState, RunEvent } from "@/types/state";

interface ReplayState {
  active: boolean;
  t: number; // epoch ms position of the playhead
}

interface SquadStore {
  // State
  squads: Map<string, SquadInfo>;
  activeStates: Map<string, SquadState>;
  events: Map<string, RunEvent[]>;
  selectedSquad: string | null;
  isConnected: boolean;
  replay: ReplayState;

  // Actions
  selectSquad: (name: string | null) => void;
  setConnected: (connected: boolean) => void;
  setSnapshot: (
    squads: SquadInfo[],
    activeStates: Record<string, SquadState>,
    events?: Record<string, RunEvent[]>,
  ) => void;
  updateSquadState: (squad: string, state: SquadState, events?: RunEvent[]) => void;
  setSquadInactive: (squad: string) => void;
  setReplayActive: (active: boolean) => void;
  setReplayT: (t: number) => void;
}

function lastEventTime(events: RunEvent[] | undefined): number {
  if (!events || events.length === 0) return Date.now();
  return Date.parse(events[events.length - 1].ts) || Date.now();
}

export const useSquadStore = create<SquadStore>((set) => ({
  squads: new Map(),
  activeStates: new Map(),
  events: new Map(),
  selectedSquad: null,
  isConnected: false,
  replay: { active: false, t: Date.now() },

  selectSquad: (name) =>
    // Leaving a squad cancels any in-progress replay
    set({ selectedSquad: name, replay: { active: false, t: Date.now() } }),

  setConnected: (connected) => set({ isConnected: connected }),

  setSnapshot: (squads, activeStates, events) =>
    set((prev) => {
      const squadMap = new Map(squads.map((s) => [s.code, s]));
      const stateMap = new Map(Object.entries(activeStates));
      // Auto-select a squad when none is chosen yet: prefer one with a live run,
      // else the first squad. Without this the office falls back to an empty/idle
      // view and the inspector asks the user to pick a squad manually.
      let selectedSquad = prev.selectedSquad;
      if (!selectedSquad && squadMap.size > 0) {
        selectedSquad = [...stateMap.keys()][0] ?? squads[0].code;
      }
      return {
        squads: squadMap,
        activeStates: stateMap,
        events: new Map(Object.entries(events ?? {})),
        selectedSquad,
      };
    }),

  updateSquadState: (squad, state, events) =>
    set((prev) => {
      const nextEvents = new Map(prev.events);
      if (events) nextEvents.set(squad, events);
      return {
        activeStates: new Map(prev.activeStates).set(squad, state),
        events: nextEvents,
        // A squad that just started running becomes the selection if none was set.
        selectedSquad: prev.selectedSquad ?? squad,
      };
    }),

  setSquadInactive: (squad) =>
    set((prev) => {
      const nextStates = new Map(prev.activeStates);
      nextStates.delete(squad);
      const nextEvents = new Map(prev.events);
      nextEvents.delete(squad);
      const wasSelected = prev.selectedSquad === squad;
      return {
        activeStates: nextStates,
        events: nextEvents,
        selectedSquad: wasSelected ? null : prev.selectedSquad,
        replay: wasSelected ? { active: false, t: Date.now() } : prev.replay,
      };
    }),

  setReplayActive: (active) =>
    set((prev) => ({
      replay: {
        active,
        t: active ? lastEventTime(prev.selectedSquad ? prev.events.get(prev.selectedSquad) : undefined) : prev.replay.t,
      },
    })),

  setReplayT: (t) => set({ replay: { active: true, t } }),
}));
