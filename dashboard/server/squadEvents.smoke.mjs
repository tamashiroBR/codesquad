import assert from "node:assert";
import { diffStates, EventTracker } from "./squadEvents.mjs";

const mk = (over = {}) => ({
  squad: "feature-builder",
  status: "running",
  step: { current: 1, total: 5, label: "spec" },
  agents: [
    { id: "a", name: "Spec", status: "idle", desk: { col: 1, row: 1 } },
    { id: "b", name: "Coder", status: "idle", desk: { col: 2, row: 1 } },
  ],
  handoff: null,
  startedAt: "2026-06-26T10:00:00.000Z",
  updatedAt: "2026-06-26T10:00:00.000Z",
  ...over,
});

// First observation seeds run-started (and no idle noise)
let ev = diffStates(null, mk());
assert.deepEqual(ev.map((e) => e.type), ["run-started"], "seed = run-started only");

// Agent goes working
const s1 = mk();
const s2 = mk({ updatedAt: "2026-06-26T10:00:05.000Z",
  agents: [{ ...s1.agents[0], status: "working" }, s1.agents[1]] });
ev = diffStates(s1, s2);
assert.deepEqual(ev.map((e) => e.type), ["agent-working"]);
assert.equal(ev[0].agentId, "a");
assert.equal(ev[0].ts, "2026-06-26T10:00:05.000Z");

// Step change + handoff + done in one diff
const s3 = mk({
  updatedAt: "2026-06-26T10:00:10.000Z",
  step: { current: 2, total: 5, label: "build" },
  agents: [{ ...s1.agents[0], status: "done" }, { ...s1.agents[1], status: "working" }],
  handoff: { from: "Spec", to: "Coder", message: "spec ready", completedAt: "2026-06-26T10:00:10.000Z" },
});
ev = diffStates(s2, s3);
const types = ev.map((e) => e.type).sort();
assert.deepEqual(types, ["agent-done", "agent-working", "handoff", "step-changed"].sort());

// Completion fires once
const done = mk({ status: "completed", updatedAt: "2026-06-26T10:01:00.000Z",
  agents: s1.agents.map((a) => ({ ...a, status: "done" })) });
ev = diffStates(s3, done);
assert.ok(ev.some((e) => e.type === "run-completed"), "completion event present");
ev = diffStates(done, done);
assert.ok(!ev.some((e) => e.type === "run-completed"), "completion does not repeat");

// EventTracker accumulates and returns deltas
const t = new EventTracker();
assert.equal(t.record("x", mk()).length, 1);             // run-started
assert.equal(t.record("x", s2).length, 1);               // agent-working
assert.ok(t.get("x").length === 2, "log accumulates");

console.log("squadEvents smoke: ALL PASS");
