import type { AgentStatus, SquadStatus } from "@/types/state";

export const AGENT_STATUS_COLOR: Record<AgentStatus, string> = {
  idle: "#6b6b86",
  working: "#00d4ff",
  delivering: "#7c5cff",
  done: "#00e676",
  checkpoint: "#ffab00",
};

export const SQUAD_STATUS_COLOR: Record<SquadStatus, string> = {
  idle: "#6b6b86",
  running: "#00d4ff",
  completed: "#00e676",
  checkpoint: "#ffab00",
};

export const AGENT_STATUS_LABEL: Record<AgentStatus, string> = {
  idle: "ocioso",
  working: "trabalhando",
  delivering: "entregando",
  done: "concluído",
  checkpoint: "checkpoint",
};
