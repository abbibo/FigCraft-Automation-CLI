# Changelog: FigCraft Subagent Roles & Multi-Agent Architecture

## 1.0.0 (2026-11-09) — Enterprise Multi-Agent Architecture & Skill Suite

### Major Architectural Overhaul
- **Modular Directory Organization:** Restructured the repository into clear, maintainable domains:
  - `architecture/`: Multi-agent hierarchy, communication data contracts, and RACI responsibility matrix.
  - `core/`: Master orchestrator state machine and universal shared invariants.
  - `subagents/`: 12 specialized subagent folders with individual `instructions.md`, `responsibilities.md`, and `inputs-outputs.md`.
  - `standards/`: Official naming conventions, output schemas, and 100-point quality control rubric.
  - `testing/`: End-to-end verification test cases and technical audit validation report.
- **Master Orchestrator Engine (`figcraft-orchestrator` & `lead-orchestrator`):** Implemented central task decomposition, dependency DAG scheduling (Levels 0–5), dynamic squad recruitment, and milestone gatekeeping.
- **Unified Skill Suite (29 Skills):** Consolidated capabilities across 4 repositories into 29 modular, strictly validated skills passing `scripts/check.mjs`.
  - Added `figcraft-icons`: Vector icon search via Iconify API with single-family enforcement.
  - Added `figcraft-svg`: Authoring native SVG vector illustrations, mascots, and logos.
  - Added `figcraft-typography`: Typographic hierarchy, Google Fonts downloading (`font.download`), and silent fallback auditing.
  - Added `figcraft-mobile-ui`: Apple HIG and Android Material 3 safe areas, status bars, and 44pt/48dp touch targets.
  - Added `figcraft-web-ui`: Desktop web, 12-column grids, Bento layouts, and split heroes.
  - Added `figcraft-optical-polish`: Concentric corner radii math ($R_{outer} = R_{inner} + P$), dark mode surface luminance stepping, and specular hairlines.
  - Added `figcraft-states-flows`: 5-State completeness matrices (Ideal, Empty, Loading, Error, Stress) and interaction states.
  - Added `figcraft-microcopy`: Real domain data seeds and action-first microcopy; zero `Lorem Ipsum`.
  - Added `figcraft-parametric-diagram`: Script-driven parametric architecture diagrams with code as source of truth.
  - Added `figcraft-visual-acceptance`: Pre-delivery screenshot verification, reference comparison, and 100-point rubric.
- **12 Subagent Roles:**
  - Orchestration: `lead-orchestrator`
  - Core: `ui-architect`, `design-system-engineer`, `frontend-engineer`
  - Specialized: `mobile-ui-specialist`, `vector-graphics-specialist`, `interaction-motion-engineer`, `data-diagram-architect`, `automation-script-specialist`, `asset-exporter`
  - Quality Assurance: `visual-qa-auditor`, `independent-acceptance-judge`
- **Automated Validation:**
  - Added `scripts/validate-subagents.mjs` for validating all subagent instructions, schemas, and links.
  - Included `scripts/ensure-figcraft.ps1` and `scripts/ensure-figcraft.sh` for attach-mode launching.
  - Included `scripts/check_tiling.py` for exported screenshot tiling verification.

---

## 0.2.0 (2026-11-08)
- New skills: `figcraft-scripting` (`run_script`) and `figcraft-import-html` (`import_html`). The plugin now has 18 skills.
- Updated: `figcraft-use`, `figcraft-audit-design`, `figcraft-export-assets`, `figcraft-design-to-code`, `figcraft-diagram`, `figcraft-files`.

---

## 0.1.0 (2026-11-07)
- First release: 16 initial skills.
