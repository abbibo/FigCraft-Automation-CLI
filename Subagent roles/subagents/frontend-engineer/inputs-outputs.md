# Frontend Engineer: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Target frame ID, target framework (React/Next.js/SwiftUI/Compose/Flutter), output directory.
- **Canvas Context:** Node tree and properties from `get_design_context`.
- **Token Definitions:** Variable mappings from `design-system-engineer`.
- **Motion Specs:** Easing curves and transition timings from `interaction-motion-engineer`.

## 2. Expected Output Format
- **Production Code Files:**
  - Component files (e.g. `components/DashboardCard.tsx`, `views/HomeView.swift`).
  - Style/Token files (e.g. `styles/tokens.css`, `tailwind.config.js`).
  - Code Connect files (e.g. `components/Button.figma.tsx`).
- **Structured Result Envelope:**
  - File paths of generated code.
  - Exported component interface definitions and props.
  - Verification confirmation.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** `ui-architect` (frames), `design-system-engineer` (tokens), `interaction-motion-engineer` (motion).
- **Handoffs To:** `lead-orchestrator` (final delivery) and User.

## 4. Escalation Path
- Escalates to `lead-orchestrator` if canvas frame geometry is inconsistent or lacks clear auto-layout hierarchy.
