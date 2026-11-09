# Vector Graphics Specialist: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** List of required icons, illustration descriptions, style guidelines.
- **Visual References:** Reference bitmaps containing logos, mascots, or decorative artwork.
- **Token Palette:** Active primary, neutral, and accent colors from `design-system-engineer`.

## 2. Expected Output Format
- **Vector Icon Frames:** Individual auto-layout frames containing 24x24px vector nodes.
- **Imported SVG Frames:** Native FigCraft frames containing parsed SVG vector paths.
- **Structured Result Envelope:**
  - Chosen icon family identifier (`lucide`, `tabler`, `ph`).
  - List of created vector node IDs and names.
  - Zero-emoji compliance confirmation.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** `design-system-engineer` (color variables).
- **Handoffs To:** `ui-architect` and `mobile-ui-specialist` (for embedding into component frames).

## 4. Escalation Path
- Escalates to `lead-orchestrator` if a requested complex illustration requires raster photography rather than vector art.
