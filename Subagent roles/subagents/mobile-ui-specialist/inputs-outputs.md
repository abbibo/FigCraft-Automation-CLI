# Mobile UI Specialist: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Target mobile platform (iOS / Android), device preset name, flow screens.
- **Tokens & Fonts:** Color variables, typography tokens, and Google Fonts from `design-system-engineer`.
- **Vector Assets:** Icon IDs from `vector-graphics-specialist`.
- **User Journey:** Screen flow (e.g. Home -> Product Details -> Bottom Sheet Checkout).

## 2. Expected Output Format
- **FigCraft Mobile Frames:**
  - `Screen/Mobile/<ScreenName>` at 80px X-offset.
  - Companion frames: `Screen/Mobile/<ScreenName>/Empty`, `Screen/Mobile/<ScreenName>/Skeleton`.
- **Structured Result Envelope:**
  - List of created mobile frame IDs, dimensions, and safe area metrics.
  - Touch target compliance confirmation.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** `design-system-engineer` (tokens), `vector-graphics-specialist` (icons).
- **Handoffs To:** `interaction-motion-engineer` (for mobile prototype wiring), `visual-qa-auditor` (for 100-point rubric), `frontend-engineer` (for React Native / SwiftUI / Compose code).

## 4. Escalation Path
- Escalates to `lead-orchestrator` if mobile navigation flows conflict with requested information density.
