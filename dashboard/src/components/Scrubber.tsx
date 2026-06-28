import type { RunEvent } from "@/types/state";
import { runDomain } from "@/lib/replay";
import { formatElapsed } from "@/lib/formatTime";

interface ScrubberProps {
  events: RunEvent[];
  active: boolean;
  t: number;
  onToggle: (active: boolean) => void;
  onSeek: (t: number) => void;
}

export function Scrubber({ events, active, t, onToggle, onSeek }: ScrubberProps) {
  if (events.length === 0) return null;
  const [t0, t1] = runDomain(events);
  const pos = active ? t : t1;

  return (
    <div className="scrubber">
      <button
        className={`scrubber-toggle ${active ? "is-replay" : "is-live"}`}
        onClick={() => onToggle(!active)}
        title={active ? "Voltar para ao vivo" : "Entrar no modo replay"}
      >
        <span className="scrubber-dot" />
        {active ? "REPLAY" : "AO VIVO"}
      </button>
      <input
        type="range"
        className="scrubber-range"
        min={t0}
        max={t1}
        step={Math.max(Math.floor((t1 - t0) / 200), 1)}
        value={pos}
        disabled={!active}
        onChange={(e) => onSeek(Number(e.target.value))}
      />
      <span className="scrubber-time">
        {formatElapsed(Math.max(pos - t0, 0))} / {formatElapsed(t1 - t0)}
      </span>
    </div>
  );
}
