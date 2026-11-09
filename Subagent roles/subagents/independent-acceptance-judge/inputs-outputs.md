# Independent Acceptance Judge: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Target frame IDs, reference image path(s), approved intentional deviations list.
- **Rendered Artifacts:** Live canvas screenshot path(s) at 1x and 2x resolution.
- **Exported Bitmaps:** Exported PNG paths to test via `check_tiling.py`.

## 2. Expected Output Format
- **Acceptance Verdict Envelope:**
  - Formal verdict: `PASS` or `FAIL`.
  - Discrepancy inventory:
    ```json
    {
      "verdict": "FAIL",
      "replicaPath": "d:/Figma Agent/exports/rendered-screen.png",
      "referencePath": "d:/Figma Agent/references/source-mockup.png",
      "tilingCheck": "PASSED",
      "issues": [
        {
          "severity": "MAJOR",
          "category": "Structural Topology",
          "where": "Top Navigation Bar (far right)",
          "what": "Reference contains User Avatar + Notification Bell; Replica only rendered Notification Bell (missing Avatar)."
        }
      ]
    }
    ```

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** `visual-qa-auditor` must approve the design before the Independent Judge conducts final reference gating.
- **Handoffs To:** `lead-orchestrator` (for final sign-off or remediation loop).

## 4. Escalation Path
- Escalates to `lead-orchestrator` if reference image resolution is too low to discern critical UI details.
