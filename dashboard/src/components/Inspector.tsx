import { useSquadStore } from "@/store/useSquadStore";
import { selectDisplayState } from "@/lib/displayState";
import { SQUAD_STATUS_COLOR } from "@/lib/statusColor";
import { Checkpoint } from "./Checkpoint";
import { Scrubber } from "./Scrubber";
import { Timeline } from "./Timeline";

export function Inspector() {
  const selectedSquad = useSquadStore((s) => s.selectedSquad);
  const liveState = useSquadStore((s) => (s.selectedSquad ? s.activeStates.get(s.selectedSquad) : undefined));
  const events = useSquadStore((s) => (s.selectedSquad ? s.events.get(s.selectedSquad) : undefined));
  const replay = useSquadStore((s) => s.replay);
  const setReplayActive = useSquadStore((s) => s.setReplayActive);
  const setReplayT = useSquadStore((s) => s.setReplayT);

  const display = selectDisplayState(liveState, events, replay);
  const evts = events ?? [];

  return (
    <aside className="inspector">
      <div className="inspector-head">Inspector</div>

      {!selectedSquad || !liveState || !display ? (
        <div className="inspector-empty">Selecione um squad ativo para inspecionar a execução.</div>
      ) : (
        <div className="inspector-body">
          <div className="inspector-status">
            <span className="inspector-dot" style={{ background: SQUAD_STATUS_COLOR[display.status] }} />
            <span className="inspector-status-label">{display.status}</span>
            <span className="inspector-step">
              {display.step.current}/{display.step.total}
              {display.step.label ? ` · ${display.step.label}` : ""}
            </span>
          </div>

          <Checkpoint state={display} />

          <Scrubber
            events={evts}
            active={replay.active}
            t={replay.t}
            onToggle={setReplayActive}
            onSeek={setReplayT}
          />

          <div className="inspector-section-title">Linha do tempo</div>
          <Timeline base={liveState} events={evts} playheadT={replay.active ? replay.t : undefined} />
        </div>
      )}
    </aside>
  );
}
