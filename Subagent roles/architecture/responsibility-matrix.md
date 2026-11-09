# Multi-Agent Responsibility Matrix (RACI)

This document establishes the RACI Matrix across the entire FigCraft design-to-implementation lifecycle:
- **R (Responsible):** The agent who executes the task.
- **A (Accountable):** The agent who approves the deliverable and holds ultimate veto power.
- **C (Consulted):** The agent who provides critical inputs, guidelines, or constraints.
- **I (Informed):** The agent kept updated on progress or handed the output.

---

## 1. Complete RACI Matrix

| Development Task Area | `lead-orchestrator` | `ui-architect` | `design-system-engineer` | `frontend-engineer` | `mobile-ui-specialist` | `vector-graphics-specialist` | `interaction-motion-engineer` | `data-diagram-architect` | `automation-script-specialist` | `asset-exporter` | `visual-qa-auditor` | `independent-acceptance-judge` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Project Intake & Scope Decomp** | **A / R** | C | C | C | C | I | I | I | I | I | I | I |
| **Token & Variable Collections** | A | C | **R** | C | C | I | I | I | C | I | C | I |
| **Light & Dark Theme Parity** | A | C | **R** | C | C | I | I | I | I | I | C | I |
| **Google Fonts Sourcing & Audits** | A | C | **R** | I | C | I | I | I | I | I | C | I |
| **Desktop Web & Dashboard Layout** | A | **R** | C | C | I | C | C | I | I | I | C | I |
| **Mobile App (iOS/Android) Screens**| A | C | C | C | **R** | C | C | I | I | I | C | I |
| **5-State Matrix (Ideal/Empty/Loading)**| A | **R** | C | C | **R** | C | C | I | I | I | C | I |
| **Realistic Domain Microcopy** | A | **R** | I | I | **R** | I | I | I | I | I | C | I |
| **Vector Icons (Iconify API Sourcing)**| A | C | C | I | C | **R** | I | I | I | I | C | I |
| **SVG Illustrations & Mascots** | A | C | C | I | C | **R** | I | I | I | I | C | I |
| **Prototype Wiring & Overlays** | A | C | I | I | C | I | **R** | I | I | I | C | I |
| **Motion Physics & Spring Curves** | A | I | C | C | I | I | **R** | I | I | I | C | I |
| **Parametric Architecture Schemas** | A | I | I | C | I | C | I | **R** | I | I | C | I |
| **Transactional Rhai Scripts** | A | I | I | I | I | I | I | I | **R** | I | I | I |
| **Design-to-Code Synthesis (React/Vue)**| A | C | C | **R** | I | I | C | I | I | I | C | I |
| **Native Mobile Code (SwiftUI/Compose)**| A | I | C | **R** | C | I | C | I | I | I | C | I |
| **Code Connect Mappings** | A | I | C | **R** | I | I | I | I | I | I | I | I |
| **Multi-Scale Asset & Token Export** | A | I | I | I | I | I | I | I | I | **R** | I | I |
| **100-Point Design QA Rubric** | A | C | C | I | C | C | C | I | I | I | **R** | I |
| **WCAG AA Accessibility Audit** | A | C | C | I | C | I | I | I | I | I | **R** | I |
| **Reference-to-Render Pixel Gate** | **A** | I | I | I | I | I | I | I | I | I | C | **R** |
| **Milestone Acceptance & Release** | **A / R** | I | I | I | I | I | I | I | I | I | C | C |

---

## 2. Cross-Agent Boundary Rules

To prevent scope creep and duplicated effort:

1. **Tokens vs. Components:** `design-system-engineer` owns variables, modes, and raw styles; `ui-architect` owns how components assemble those tokens into layouts.
2. **Icons vs. Illustrations:** `vector-graphics-specialist` is the sole owner of all vector imagery. Neither `ui-architect` nor `mobile-ui-specialist` may hand-draw pseudo-icons or insert emoji characters.
3. **Desktop vs. Mobile:** `ui-architect` owns viewports $\ge 768\text{px}$; `mobile-ui-specialist` owns mobile phones ($< 768\text{px}$) and platform-specific ergonomics.
4. **Design vs. Code:** Canvas modifications are owned by Tiers 1-3. `frontend-engineer` has strictly **read-only** canvas access to extract design context and generate external source code.
5. **Quality Review vs. Fix Implementation:** `visual-qa-auditor` and `independent-acceptance-judge` never touch canvas coordinates directly. They log defects; the responsible author applies the remediation.
