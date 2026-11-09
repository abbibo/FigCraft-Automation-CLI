# Standards: Output Formats & Handoff Schemas

This document defines the strict schema specifications for all structured outputs emitted by subagents during the execution lifecycle.

---

## 1. Subagent Execution Report Schema (JSON)

Every subagent must return a structured completion payload to `lead-orchestrator`:

```json
{
  "$schema": "https://figcraft.local/schemas/subagent-result.json",
  "taskId": "string (UUID or semantic format, e.g. TASK-2026-001)",
  "agent": "string (subagent-name)",
  "timestamp": "ISO-8601 string",
  "status": "COMPLETED | FAILED | ESCALATED",
  "summary": "1-3 sentence human-readable description of work done",
  "canvasArtifacts": {
    "createdNodes": [
      {
        "id": "string (e.g. 14:102)",
        "name": "string (semantic name)",
        "type": "FRAME | TEXT | VECTOR | COMPONENT | INSTANCE",
        "dimensions": { "width": 1440, "height": 900 }
      }
    ],
    "modifiedNodes": ["string"],
    "deletedNodes": ["string"]
  },
  "fileArtifacts": [
    {
      "path": "string (absolute file path)",
      "format": "PNG | SVG | PDF | CSS | JSON | TSX",
      "bytes": 1048576
    }
  ],
  "verificationProof": {
    "screenshotPath": "string (path to rendered canvas screenshot)",
    "checksPassed": ["string"]
  },
  "handoff": {
    "nextAgent": "string (recommended downstream agent)",
    "unblockedTasks": ["string"]
  },
  "warnings": ["string"]
}
```

---

## 2. QA Defect Audit Schema (JSON)

Emitted by `visual-qa-auditor` and `independent-acceptance-judge`:

```json
{
  "$schema": "https://figcraft.local/schemas/qa-audit.json",
  "auditId": "string",
  "targetFrameId": "string",
  "targetFrameName": "string",
  "auditor": "visual-qa-auditor | independent-acceptance-judge",
  "timestamp": "ISO-8601 string",
  "verdict": "PASS | FAIL",
  "overallScore": 88,
  "scoreBreakdown": {
    "visualHierarchy": 18,
    "layoutGeometry": 19,
    "opticalCraft": 17,
    "authenticity": 18,
    "uxCopyAndStates": 16
  },
  "defects": [
    {
      "id": "DEF-001",
      "severity": "CRITICAL | MAJOR | MINOR",
      "category": "Layout Geometry | Optical Craft | Contrast | Anti-Slop | Microcopy",
      "nodeId": "string",
      "nodeName": "string",
      "coordinates": { "x": 120, "y": 450 },
      "description": "string",
      "remediationRequired": "string",
      "assignedAgent": "string (responsible subagent)"
    }
  ]
}
```

---

## 3. Mandatory Output Directory Rule

**All deliverables, exports, reports, and generated assets MUST be saved strictly in:**
`D:\Figma Agent\FinalOut`

- **Never** write exports, screenshots, reports, or generated deliverables into the codebase or source folders.
- Organize final outputs into clearly named subfolders under `D:\Figma Agent\FinalOut` (e.g. `FinalOut/exports/`, `FinalOut/reports/`, `FinalOut/screenshots/`, `FinalOut/tokens/`).

---

## 4. Visual Delivery Artifacts

When delivering final visual assets:
- **Screenshots:** Captured via `screenshot` at full frame bounds without canvas chrome or editor selection boxes into `D:\Figma Agent\FinalOut/screenshots/`.
- **High-Resolution Exports:** 2x or 3x PNG exports saved into `D:\Figma Agent\FinalOut/exports/` and must pass `scripts/check_tiling.py` verification with zero pixel diff across sliced halves.
- **Design Tokens:** Tokens exported into `D:\Figma Agent\FinalOut/tokens/` as valid DTCG JSON (`tokens.json`), CSS Custom Properties (`tokens.css`), and Tailwind theme extensions (`tailwind.tokens.js`).
