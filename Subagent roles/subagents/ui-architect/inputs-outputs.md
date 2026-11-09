# UI Architect: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Target frame name, page type, viewport width.
- **Design Tokens:** Collection IDs and variable keys from `design-system-engineer`.
- **Vector Assets:** Icon node IDs or SVG vector paths from `vector-graphics-specialist`.
- **Feature Requirements:** Navigation items, hero structure, card lists, data tables.
- **Domain Context:** Industry, terminology, data seeds (e.g. Fintech transaction records).

## 2. Expected Output Format
- **FigCraft Auto-Layout Nodes:**
  - Root Frame: `Screen/<FeatureName>` at designated X-offset (80px gap).
  - Child Frames: Semantic containers (`Header/Navigation`, `Section/Hero`, `Section/BentoGrid`, `Card/<Name>`).
  - Companion Frames: `Screen/<FeatureName>/Empty`, `Screen/<FeatureName>/Loading`.
- **Structured Result Envelope:**
  - List of created node IDs and frame dimensions.
  - Bound variable token mappings.
  - Handoff notification for `interaction-motion-engineer` and `visual-qa-auditor`.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** `design-system-engineer` (tokens must exist first), `vector-graphics-specialist` (icons).
- **Handoffs To:** `interaction-motion-engineer` (for prototype wiring), `visual-qa-auditor` (for 100-point rubric), `frontend-engineer` (for code synthesis).

## 4. Escalation Path
- Escalates to `lead-orchestrator` if token collections are missing or if content requirements exceed viewport capacity without defined scrolling rules.
