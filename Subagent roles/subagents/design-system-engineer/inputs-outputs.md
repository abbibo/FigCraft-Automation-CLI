# Design System Engineer: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Target design system name, brand colors, typographic preferences.
- **Visual References:** Screenshots or style guides defining colors, elevation, and component styles.
- **Codebase Themes (Optional):** Existing `tailwind.config.js` or theme tokens to mirror in FigCraft.

## 2. Expected Output Format
- **FigCraft Variable Collections:**
  - `Core/Colors` (Light and Dark modes).
  - `Core/Spacing`, `Core/Radii`, `Core/Elevation`.
- **Downloaded Fonts:** Verified active font families on disk.
- **Component Sets:** Master components (`Button`, `Input`, `Badge`, `CardShell`) with variant sets.
- **Structured Result Envelope:**
  - Collection IDs, variable IDs, and token paths.
  - Active font families report.
  - Notification unblocking `ui-architect` and `mobile-ui-specialist`.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** None (Level 0 Foundation).
- **Handoffs To:** `ui-architect`, `mobile-ui-specialist`, `frontend-engineer`, `visual-qa-auditor`.

## 4. Escalation Path
- Escalates to `lead-orchestrator` if brand contrast requirements are physically incompatible with WCAG AA accessibility thresholds.
