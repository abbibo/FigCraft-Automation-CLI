# FigCraft Multi-Agent Design & Engineering Framework

A production-grade, unified multi-agent architecture and consolidated skill suite for [FigCraft](https://github.com/storytold/figcraft) development. This repository integrates capabilities across leading FigCraft engineering repositories into an industrial-grade ecosystem of **29 specialized skills** and **12 coordinated subagent roles**.

Given a design reference (Figma, screenshots, mocks) and development requirements, this framework autonomously organizes, sequences, executes, and validates the entire design-to-code pipeline.

---

## Architecture Overview

```
                      +------------------------------------------+
                      |         User Task & Design Reference      |
                      +------------------------------------------+
                                           |
                                           v
                      +------------------------------------------+
                      |   lead-orchestrator (figcraft-orchestrator)|
                      |    - Design & Technical Analysis         |
                      |    - Dependency Graph Scheduling         |
                      |    - Dynamic Subagent Team Assembly       |
                      +------------------------------------------+
                                           |
       +-----------------------------------+-----------------------------------+
       |                                   |                                   |
       v                                   v                                   v
+-----------------------+       +-----------------------+       +-----------------------+
|      Foundations      |       |  Structure & Layout   |       |  Specialized Vector   |
| design-system-engineer|       |     ui-architect      |       |vector-graphics-special|
| - Variables & Tokens  |       | - Screens & Frames    |       | - Iconify Vector Icons|
| - Light/Dark Modes    |       | - Auto-Layout Grids   |       | - Native SVG Mascots  |
| - Google Fonts Mgmt   |       | - 5-State Completeness|       | - Zero Emoji Paths    |
+-----------------------+       +-----------------------+       +-----------------------+
       |                                   |                                   |
       |               +-------------------+-------------------+               |
       |               |                                       |               |
       v               v                                       v               v
+-----------------------+                               +-----------------------+
|  Mobile UI Specialist |                               |  Interaction & Motion |
| - Apple HIG / MD3     |                               | - Prototype Flow Wire |
| - Safe Area Geometry  |                               | - Overlays & Easing   |
| - 44pt/48dp Tap Bounds|                               | - Spring Motion Specs |
+-----------------------+                               +-----------------------+
       \                                                       /
        \                                                     /
         +--------------------------+------------------------+
                                    |
                                    v
                     +-----------------------------+
                     |      frontend-engineer      |
                     |  - React / Next.js / Vue    |
                     |  - SwiftUI / Compose/Flutter|
                     |  - Design-to-Code Tokens    |
                     |  - Code Connect Mappings    |
                     +-----------------------------+
                                    |
                                    v
                     +-----------------------------+
                     |    Quality Assurance Loop   |
                     | - visual-qa-auditor         |
                     |   (100-pt rubric, contrast) |
                     | - independent-judge         |
                     |   (pixel-to-reference gate) |
                     +-----------------------------+
                                    |
                                    v
                     +-----------------------------+
                     |       asset-exporter        |
                     | - 1x/2x/3x PNG, SVG, PDF    |
                     | - DTCG, Tailwind, CSS Tokens|
                     | - Checkpoint & Save State   |
                     +-----------------------------+
```

---

## Directory Architecture

The repository is structured into modular domains that cleanly separate architecture, core governance, subagent specifications, design standards, procedural skills, and testing:

```
Subagent roles/
├── README.md                           # Master framework documentation
├── CHANGELOG.md                        # Version history and upgrade notes
├── architecture/                       # System architecture specifications
│   ├── agent-hierarchy.md              # 4-Tier authority and reporting hierarchy
│   ├── communication-flow.md           # Message envelopes, data contracts, sync/async handoffs
│   └── responsibility-matrix.md        # Comprehensive RACI matrix across all tasks
├── core/                               # Core orchestration engines
│   ├── orchestrator.md                 # 6-Phase orchestrator state machine and lifecycle
│   └── shared-instructions.md          # Universal invariants (coordinates, concentric radii, zero emoji)
├── subagents/                          # Modular subagent folders (12 specialized agents)
│   ├── lead-orchestrator/              # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── ui-architect/                   # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── design-system-engineer/         # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── frontend-engineer/              # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── mobile-ui-specialist/           # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── vector-graphics-specialist/     # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── interaction-motion-engineer/    # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── data-diagram-architect/         # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── automation-script-specialist/   # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── asset-exporter/                 # instructions.md, responsibilities.md, inputs-outputs.md
│   ├── visual-qa-auditor/              # instructions.md, responsibilities.md, inputs-outputs.md
│   └── independent-acceptance-judge/   # instructions.md, responsibilities.md, inputs-outputs.md
├── roles/                              # Plugin role definitions for Claude Code / Antigravity
├── skills/                             # 29 modular procedural FigCraft skills (tested via check.mjs)
├── standards/                          # Design and implementation standards
│   ├── naming-conventions.md           # Canvas layer, frame, component, and token naming rules
│   ├── output-standards.md             # JSON schemas for task results, defects, and handoffs
│   └── quality-control.md              # 100-Point Design Critique Rubric and defect classification
├── testing/                            # Verification suite
│   ├── test-cases.md                   # Realistic test scenarios (SaaS, Mobile, Diagram, Script)
│   └── validation-report.md            # Technical audit verification report and sign-offs
├── references/                         # Reference assets (vector-icons-24px.md)
└── scripts/                            # Validation and automation utilities
    ├── check.mjs                       # Skill format linter
    ├── validate-subagents.mjs          # Subagent ecosystem validator
    ├── ensure-figcraft.ps1             # Attach-mode launcher (Windows)
    ├── ensure-figcraft.sh              # Attach-mode launcher (POSIX)
    └── check_tiling.py                 # Screenshot tiling diff checker
```

---

## Subagent Role Inventory (12 Roles)

The framework organizes subagents into four operational tiers. Each role is defined as a standalone markdown configuration in [`roles/`](roles/).

### 1. Orchestration Tier
| Role | File | Primary Responsibility | Primary Skills |
|---|---|---|---|
| **Lead Orchestrator** | [`roles/lead-orchestrator.md`](roles/lead-orchestrator.md) | Pipeline intake, dependency graph scheduling, subagent assembly, milestone verification | `figcraft-orchestrator`, `figcraft-files`, `figcraft-visual-acceptance`, `figcraft-use` |

### 2. Core Tier (Required for Most Projects)
| Role | File | Primary Responsibility | Primary Skills |
|---|---|---|---|
| **UI Architect** | [`roles/ui-architect.md`](roles/ui-architect.md) | Screen layouts, desktop/web bento grids, auto-layout hierarchy, 5-state matrices | `figcraft-use`, `figcraft-generate-design`, `figcraft-web-ui`, `figcraft-states-flows`, `figcraft-microcopy`, `figcraft-import-html` |
| **Design System Engineer** | [`roles/design-system-engineer.md`](roles/design-system-engineer.md) | Variable collections, token themes (Light/Dark), font downloads, concentric geometry | `figcraft-generate-library`, `figcraft-typography`, `figcraft-optical-polish`, `figcraft-code-connect` |
| **Frontend Engineer** | [`roles/frontend-engineer.md`](roles/frontend-engineer.md) | Code generation (React, Vue, SwiftUI, Compose, Flutter), token binding, Code Connect | `figcraft-design-to-code`, `figcraft-native-code`, `figcraft-code-connect`, `figcraft-motion` |

### 3. Specialized Tier (Activated on Demand)
| Role | File | Primary Responsibility | Primary Skills |
|---|---|---|---|
| **Mobile UI Specialist** | [`roles/mobile-ui-specialist.md`](roles/mobile-ui-specialist.md) | iOS HIG and Android M3 ergonomics, safe areas, status/home bars, 44pt/48dp tap bounds | `figcraft-mobile-ui`, `figcraft-states-flows`, `figcraft-use`, `figcraft-icons` |
| **Vector Graphics Specialist** | [`roles/vector-graphics-specialist.md`](roles/vector-graphics-specialist.md) | Iconify API vector icon sourcing, custom SVG illustrations, mascots, zero emoji icons | `figcraft-icons`, `figcraft-svg`, `figcraft-use` |
| **Interaction & Motion Engineer** | [`roles/interaction-motion-engineer.md`](roles/interaction-motion-engineer.md) | Clickable prototypes, modal overlays, smart transitions, exit-faster-than-enter motion | `figcraft-prototype`, `figcraft-motion`, `figcraft-states-flows` |
| **Data & Diagram Architect** | [`roles/data-diagram-architect.md`](roles/data-diagram-architect.md) | Parametric code diagrams, Mermaid vector charts, publication figures, whiteboards | `figcraft-parametric-diagram`, `figcraft-diagram`, `figcraft-boards`, `figcraft-svg` |
| **Automation Script Specialist** | [`roles/automation-script-specialist.md`](roles/automation-script-specialist.md) | Transactional Rhai scripts with atomic rollback, WASM plugins, bulk canvas operations | `figcraft-scripting`, `figcraft-plugins`, `figcraft-apply-everywhere` |
| **Asset Exporter** | [`roles/asset-exporter.md`](roles/asset-exporter.md) | Multi-scale raster/vector exports (PNG 1x-3x, SVG, PDF), DTCG/Tailwind tokens, checkpoints | `figcraft-export-assets`, `figcraft-files`, `figcraft-design-to-code` |

### 4. Quality Assurance Tier
| Role | File | Primary Responsibility | Primary Skills |
|---|---|---|---|
| **Visual QA Auditor** | [`roles/visual-qa-auditor.md`](roles/visual-qa-auditor.md) | 100-Point design critique, squint test, concentric radii, WCAG AA contrast, global fixes | `figcraft-audit-design`, `figcraft-optical-polish`, `figcraft-apply-everywhere`, `figcraft-comments` |
| **Independent Acceptance Judge** | [`roles/independent-acceptance-judge.md`](roles/independent-acceptance-judge.md) | Reference-to-render pixel comparison, screenshot tiling checks, formal PASS/FAIL gate | `figcraft-visual-acceptance`, `figcraft-files`, `figcraft-export-assets` |

---

## Consolidated Skills Catalog (29 Skills)

All 29 skills live in [`skills/`](skills/) and pass automated validation via `node scripts/check.mjs`.

### Orchestration & System Governance
- `figcraft-orchestrator`: Master workflow decomposition, subagent team assembly, and execution tracking.
- `figcraft-use`: Low-level engine MCP operations, batch command envelope, $ref references, undo.
- `figcraft-files`: Document management, headless/attached mode, checkpoints, and visual diffs.

### Foundation & Aesthetics
- `figcraft-generate-library`: Design system tokens, variable collections, Light/Dark modes, component variants.
- `figcraft-typography`: Font hierarchies, Google Fonts integration (`font.download`), silent fallback audits.
- `figcraft-optical-polish`: Concentric radii math ($R_{outer} = R_{inner} + P$), dark mode surface luminance, specular hairlines.
- `figcraft-microcopy`: Real domain data seeds, zero Lorem Ipsum, action-oriented CTAs.

### Layout & Platforms
- `figcraft-generate-design`: Auto-layout screen assembly, responsive constraints, section-by-section building.
- `figcraft-web-ui`: Desktop web, 12-column grids, Bento layouts, split heroes, SaaS dashboards.
- `figcraft-mobile-ui`: iOS HIG and Android Material 3, safe areas, status bars, 44pt/48dp touch bounds.
- `figcraft-states-flows`: 5-state matrices (Ideal, Empty, Loading, Error, Stress) and interaction states.
- `figcraft-import-html`: Converting static HTML/CSS into editable auto-layout FigCraft frames.

### Vector Art & Diagramming
- `figcraft-icons`: Vector icon discovery via Iconify API, single set enforcement, 24px SVG paths.
- `figcraft-svg`: Authoring native curved SVG illustrations, mascots, logos, and vector imports.
- `figcraft-parametric-diagram`: Script-driven architecture diagrams, system topologies, publication figures.
- `figcraft-diagram`: Converting Mermaid syntax (flowcharts, sequence, ERD) into vector canvas nodes.
- `figcraft-boards`: Whiteboard canvas spaces, sticky notes, connectors, tables, and voting sections.

### Interactivity & Code Generation
- `figcraft-prototype`: Clickable prototypes, overlays, scroll regions, and navigation wiring.
- `figcraft-motion`: Transition curves, easing inspection, smart animation extraction.
- `figcraft-design-to-code`: Production code generation from design frames with token references.
- `figcraft-native-code`: Idiomatic SwiftUI, Jetpack Compose, and Flutter code synthesis.
- `figcraft-code-connect`: Bi-directional mapping between FigCraft components and codebase files.

### Automation, Tooling & Quality Assurance
- `figcraft-audit-design`: Automated linting for literal colors, WCAG AA contrast, touch bounds, layer naming.
- `figcraft-visual-acceptance`: Pre-delivery screenshot verification, reference comparison, and 100-point rubric.
- `figcraft-apply-everywhere`: Cross-screen batch property propagation with preview verification.
- `figcraft-comments`: Design review comment resolution, threaded replies, and feedback loops.
- `figcraft-export-assets`: Multi-resolution raster/vector asset export, DTCG/Tailwind tokens, contact sheets.
- `figcraft-scripting`: Rhai transactional batch scripting with atomic rollback on errors.
- `figcraft-plugins`: WebAssembly plugin authoring, manifest management, and execution.

---

## 11-Step Design-to-Implementation Lifecycle

1. **Intake & Environment Verification**: Detect or auto-launch FigCraft in attached mode (`--control 7979` or `47800`) or headless mode. Load or initialize `.figcraft` document.
2. **Design & Technical Analysis**: Decompose visual inputs (layout, typography, palette, radii, states) and architectural requirements (components, data models, frameworks).
3. **Dependency Graph Construction**: Structure tasks across Level 0 (Foundations), Level 1 (Assets), Level 2 (Shell & Layout), Level 3 (Optical Polish), Level 4 (Interactions), and Level 5 (Validation).
4. **Dynamic Subagent Selection**: Assign tasks to core and specialized subagents with precise inputs and success criteria.
5. **Foundations Phase**: Design System Engineer creates variable collections, Light/Dark modes, typographic scale, and downloads required Google Fonts.
6. **Vector Asset Sourcing**: Vector Graphics Specialist retrieves icons from Iconify or authors native SVG illustrations.
7. **Structural Construction**: UI Architect and Mobile UI Specialist build responsive frames with auto-layout and 5-state matrices.
8. **Optical Polish & Microcopy Pass**: Apply concentric border radii, surface luminance stepping, and realistic domain microcopy.
9. **Interactive Wiring**: Interaction Engineer connects prototype actions, modals, and motion curves.
10. **Independent Quality Gate**: Visual QA Auditor runs the 100-point rubric; Independent Acceptance Judge compares rendered screenshots against the source reference. Corrective actions return to responsible agents.
11. **Code Synthesis & Export**: Frontend Engineer generates production code; Asset Exporter generates asset packages and design tokens. Save `.figcraft` checkpoint.

---

## Verification & Testing

Verify that all skills meet plugin standards:

```bash
node scripts/check.mjs
```

Ensure FigCraft is running in live attach mode:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "scripts/ensure-figcraft.ps1"
```

Verify exported screenshot tiling integrity:

```bash
python scripts/check_tiling.py <exported_image.png>
```

---

## License

MIT OR Apache-2.0.
