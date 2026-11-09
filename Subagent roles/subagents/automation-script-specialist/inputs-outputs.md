# Automation & Script Specialist: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Target script operation, matching criteria (layer names, types, properties), mutation logic.
- **Canvas Context:** Node tree from `inspect_document` or specific frame IDs.

## 2. Expected Output Format
- **Rhai Execution Logs:** Transaction status, affected node counts, mutation diff.
- **Compiled Plugin Assets (If requested):** `.wasm` binary and `figcraft-plugin.json` manifest.
- **Structured Result Envelope:**
  - Success status and transaction ID.
  - Count of updated, created, or deleted nodes.
  - Rollback confirmation if errors were encountered.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** `figcraft-use` (engine runtime).
- **Handoffs To:** `lead-orchestrator` and `visual-qa-auditor`.

## 4. Escalation Path
- Escalates to `lead-orchestrator` if script operations fail due to engine permission restrictions or irreversible corruption risks.
