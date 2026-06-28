import type { SquadState, RunEvent } from "@/types/state";
import { runDomain, computeSegments, eventTime } from "@/lib/replay";
import { AGENT_STATUS_COLOR, AGENT_STATUS_LABEL } from "@/lib/statusColor";

interface TimelineProps {
  base: SquadState;
  events: RunEvent[];
  playheadT?: number; // epoch ms; draws a vertical marker when in replay
}

const MARKER_LABEL: Partial<Record<RunEvent["type"], string>> = {
  handoff: "handoff",
  "step-changed": "passo",
  "run-completed": "fim",
  "run-started": "início",
};

const ROW_H = 26;
const GUTTER = 92;

export function Timeline({ base, events, playheadT }: TimelineProps) {
  const [t0, t1] = runDomain(events);
  const span = Math.max(t1 - t0, 1);
  const pct = (ts: number) => `${(((ts - t0) / span) * 100).toFixed(2)}%`;

  const segments = computeSegments(base, events, t1);
  const segByAgent = new Map<string, ReturnType<typeof computeSegments>>();
  for (const seg of segments) {
    const arr = segByAgent.get(seg.agentId) ?? [];
    arr.push(seg);
    segByAgent.set(seg.agentId, arr);
  }

  const markers = events.filter((e) => MARKER_LABEL[e.type]);

  return (
    <div className="timeline">
      {/* Event marker lane */}
      <div className="timeline-row" style={{ height: 18 }}>
        <div className="timeline-gutter" style={{ fontSize: 10, color: "var(--text-secondary)" }}>
          eventos
        </div>
        <div className="timeline-track">
          {markers.map((e, i) => (
            <div
              key={i}
              className="timeline-marker"
              style={{ left: pct(eventTime(e)) }}
              title={`${MARKER_LABEL[e.type]}${e.from ? ` ${e.from} → ${e.to}` : ""}${e.label ? `: ${e.label}` : ""}`}
            />
          ))}
        </div>
      </div>

      {/* One row per agent */}
      {base.agents.map((agent) => (
        <div className="timeline-row" key={agent.id} style={{ height: ROW_H }}>
          <div className="timeline-gutter" title={agent.name}>
            {agent.name}
          </div>
          <div className="timeline-track">
            <div className="timeline-baseline" />
            {(segByAgent.get(agent.id) ?? []).map((seg, i) => {
              const left = ((seg.start - t0) / span) * 100;
              const width = Math.max(((seg.end - seg.start) / span) * 100, 0.8);
              return (
                <div
                  key={i}
                  className="timeline-bar"
                  style={{
                    left: `${left.toFixed(2)}%`,
                    width: `${width.toFixed(2)}%`,
                    background: AGENT_STATUS_COLOR[seg.status],
                  }}
                  title={`${agent.name} — ${AGENT_STATUS_LABEL[seg.status]} (${Math.round((seg.end - seg.start) / 1000)}s)`}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Playhead */}
      {playheadT != null && (
        <div
          className="timeline-playhead"
          style={{ left: `calc(${GUTTER}px + (100% - ${GUTTER}px) * ${(playheadT - t0) / span})` }}
        />
      )}
    </div>
  );
}
