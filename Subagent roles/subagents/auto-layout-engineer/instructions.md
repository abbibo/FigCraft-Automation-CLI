# Auto Layout Engineer — Execution Instructions

## Invariant Execution Protocol
1. **Never mutate without reading first**: Always run `find_nodes` or `inspect_document` to inspect existing layer tree and bounds.
2. **Deterministic Inference**:
   - Compare horizontal and vertical variances of child bounds.
   - Respect configurable tolerance ($\pm 2\text{px}$).
   - Tag overlapping children or badges as `absolute: true`.
3. **Safe Conversion**:
   - High confidence ($\ge 0.85$): Apply automatically.
   - Medium confidence ($0.60 - 0.84$): Generate reviewable conversion plan.
   - Low confidence ($< 0.60$): Preserve absolute positioning.
4. **Preset Management**:
   - Never overwrite presets with `locked: true` without explicit instruction.
   - Bulk updates match semantic hooks (e.g. `#header`, `#footer`, `#nav`).
5. **Idempotence**:
   - Re-running conversion on already converted Auto Layout frames must preserve valid properties and never create redundant wrapper frames.

