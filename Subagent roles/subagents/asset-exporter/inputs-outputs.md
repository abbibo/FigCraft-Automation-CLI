# Asset Exporter: Inputs, Outputs & Communication Contracts

## 1. Input Requirements
- **Task Dispatch Envelope:** Node IDs to export, export formats (PNG, SVG, PDF, tokens), destination paths, scale factors.
- **Canvas Context:** Active `.figcraft` document.

## 2. Expected Output Format
- **Exported File Artifacts (Mandatory Destination: `D:/Figma Agent/FinalOut/`):**
  - Raster assets: `FinalOut/<name>@1x.png`, `FinalOut/<name>@2x.png`.
  - Vector assets: `FinalOut/<name>.svg`.
  - Token packages: `FinalOut/tokens.css`, `FinalOut/tokens.json`.
- **Structured Result Envelope:**
  - Full absolute paths of all written assets.
  - File byte sizes and format confirmations.
  - Document checkpoint ID.

## 3. Downstream Handoffs & Dependencies
- **Dependencies:** All previous construction phases must be complete.
- **Handoffs To:** `lead-orchestrator` and User.

## 4. Escalation Path
- Escalates to `lead-orchestrator` if file system permissions prevent writing to the target output directory.
