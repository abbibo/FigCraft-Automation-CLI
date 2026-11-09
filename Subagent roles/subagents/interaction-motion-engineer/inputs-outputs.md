# Interaction & Motion Engineer: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Primary user flows, starting screen ID, interaction requirements.
- **Canvas Nodes:** Screen frame IDs, button IDs, and overlay dialog IDs from `ui-architect` or `mobile-ui-specialist`.

## 2. Expected Output Format
- **FigCraft Prototype Connections:**
  - Prototype interactions attached to hotspot nodes.
  - Defined flow starting point (`proto.flow.add`).
- **Motion Specification Document:**
  - Transition duration tables (enter vs exit).
  - Easing curves (cubic-bezier / spring parameters).
- **Structured Result Envelope:**
  - Count of wired interactions and validated flows.
  - Zero-deadlock prototype verification.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** `ui-architect` or `mobile-ui-specialist` (screens must exist).
- **Handoffs To:** `visual-qa-auditor` (for interaction review) and `frontend-engineer` (for code animation specs).

## 4. Escalation Path
- Escalates to `lead-orchestrator` if critical user paths lack destination screens.
