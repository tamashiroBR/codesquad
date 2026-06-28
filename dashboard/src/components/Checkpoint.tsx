import { useEffect, useState } from "react";
import type { SquadState } from "@/types/state";
import { formatElapsed } from "@/lib/formatTime";

interface CheckpointProps {
  state: SquadState;
}

/**
 * Surfaces a pending checkpoint: which decision is waiting and on whom. The
 * dashboard is read-only — approval happens in the host IDE (Claude Code /
 * Cursor) where the squad actually runs — so this panel informs, it doesn't act.
 */
export function Checkpoint({ state }: CheckpointProps) {
  const waiting = state.agents.filter((a) => a.status === "checkpoint");
  const isCheckpoint = state.status === "checkpoint" || waiting.length > 0;

  const [since, setSince] = useState("");
  useEffect(() => {
    if (!isCheckpoint) return;
    const base = Date.parse(state.updatedAt) || Date.now();
    const tick = () => setSince(formatElapsed(Date.now() - base));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isCheckpoint, state.updatedAt]);

  if (!isCheckpoint) return null;

  return (
    <div className="checkpoint-card">
      <div className="checkpoint-head">
        <span className="checkpoint-pulse" />
        <span>Aguardando aprovação</span>
        {since && <span className="checkpoint-since">há {since}</span>}
      </div>
      <div className="checkpoint-step">
        Passo {state.step.current}/{state.step.total}
        {state.step.label ? ` — ${state.step.label}` : ""}
      </div>
      {waiting.length > 0 && (
        <div className="checkpoint-agents">
          {waiting.map((a) => a.name).join(", ")}
        </div>
      )}
      <div className="checkpoint-hint">
        Aprove no checkpoint dentro da sua IDE para o squad continuar.
      </div>
    </div>
  );
}
