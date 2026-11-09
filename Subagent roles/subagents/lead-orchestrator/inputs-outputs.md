# Lead Orchestrator: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **User Prompt / PRD:** High-level user description, functional specs, user journeys.
- **Visual References (Optional):** Image URLs, screenshot paths, Figma URLs.
- **Codebase Context (Optional):** Existing React/Next.js/Tailwind components or theme tokens.
- **Target Specifications:** Target device/platform, light/dark mode requirements, language/locale.

## 2. Expected Output Format
- **Task Execution Plan (DAG):** Structured breakdown of milestones, phases, and assigned agents.
- **Final Delivery Report:**
  - Executive summary of implemented screens and features.
  - Design system summary (variable collections, typography styles, Google Fonts downloaded).
  - QA audit score breakdown (100-point rubric score and category breakdown).
  - Independent acceptance verdict (`PASS` or `FAIL` with visual comparison notes).
  - Exported asset paths and generated code component locations.
  - Active `.figcraft` document path.

## 3. Downstream Handoffs & Dependencies
- **Handoffs To:** `design-system-engineer`, `vector-graphics-specialist`, `ui-architect`, `mobile-ui-specialist`, `interaction-motion-engineer`, `visual-qa-auditor`, `independent-acceptance-judge`, `frontend-engineer`, `asset-exporter`.
- **Dependencies:** None. Top of hierarchy.

## 4. Escalation Path
- Escalates directly to the User when user-level design decisions or severe ambiguities block execution.
