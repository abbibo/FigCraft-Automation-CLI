# Visual QA Auditor: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Target frame IDs, audit scope (full screen, component set, flow).
- **Canvas Context:** Live canvas screenshot path, node hierarchy from `inspect_document`.
- **Benchmark Threshold:** Minimum passing score (default: 85/100).

## 2. Expected Output Format
- **QA Defect Log Envelope:**
  - Overall numerical score (0-100) and category breakdown.
  - Itemized list of defects with severity (Critical, Major, Minor).
  - Target node ID, element name, coordinate location, and violation description.
  - Assigned remediation subagent for each defect.
- **Remediation Batch (If applying fixes):** Preview diff from `figcraft-apply-everywhere`.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** Screen construction must be complete before auditing.
- **Handoffs To:** `lead-orchestrator` (for escalation) or originating subagents (for fixes).

## 4. Escalation Path
- Escalates to `lead-orchestrator` when critical layout defects cannot be resolved without restructuring page hierarchy.
