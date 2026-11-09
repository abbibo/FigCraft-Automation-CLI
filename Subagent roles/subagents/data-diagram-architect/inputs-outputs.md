# Data & Diagram Architect: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Diagram type (architecture, sequence, flowchart, ERD, whiteboard), scope.
- **Codebase / PRD:** Actual project source code, repository structure, service definitions.
- **Mermaid Syntax (Optional):** Raw Mermaid text to convert to canvas vectors.

## 2. Expected Output Format
- **FigCraft Diagram Frame:**
  - `Diagram/<Title>` containing calculated lanes, node boxes, and connectors.
  - Whiteboard sections and sticky note grids.
- **Parametric Script (Optional):** Python script as the single source of truth for the diagram.
- **Structured Result Envelope:**
  - Node and connector counts.
  - Verification of accurate topological mapping.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** None (operates from codebase facts or prompt specifications).
- **Handoffs To:** `asset-exporter` (for high-resolution PNG/SVG/PDF export) and `visual-qa-auditor`.

## 4. Escalation Path
- Escalates to `lead-orchestrator` if source code architecture contains unresolvable circular dependencies or missing service definitions.
