# Step 02 — Mapa + Rede de Segurança (mapper)

The mapper runs `map-target` then `safety-net`:
- Names the dominant smell from `pipeline/data/refactor-catalog.md`.
- Establishes characterization tests that pin current behavior and proves them green.
- Produces `output/target.md` and `output/safety-net.md`.

If the target is untestable as-is, the mapper flags the preparatory step (make it testable) —
that flag is surfaced at the next checkpoint, not silently executed.
