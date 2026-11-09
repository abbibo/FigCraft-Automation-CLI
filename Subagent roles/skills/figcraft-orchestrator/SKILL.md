---
name: figcraft-orchestrator
description: Coordinates end-to-end FigCraft design and development pipelines by breaking tasks into dependency graphs, assigning specialized subagents, and verifying delivery against design specs. Use when leading a multi-agent UI project, taking a reference design to implementation, or assembling a coordinated FigCraft agent team.
---

# FigCraft Master Orchestrator

Master orchestration skill for coordinating complex FigCraft design and development workflows across specialized subagents.

## 1. Intake and Requirement Decomposition

When receiving a reference design, user requirements, or codebase context:

1. **Classify the Scope**:
   - Platform: Mobile (iOS/Android), Desktop Web, SaaS Dashboard, or Whiteboard/Diagram.
   - Mode: Green-field creation, design reconstruction from reference, or design-to-code implementation.
2. **Decompose Functional & Visual Requirements**:
   - Layout geometry, safe areas, viewport constraints.
   - Typography, colors, surface elevations, and token requirements.
   - Component hierarchy, reusable variants, and states (5-state completeness).
   - Interactions, transitions, prototype navigation, and code handoff targets.
3. **Build the Execution Dependency Graph**:
   - Level 0 (Foundations): Design tokens, typography, palettes (`figcraft-generate-library`, `figcraft-typography`).
   - Level 1 (Assets & Icons): Vectors, illustrations, Iconify icons (`figcraft-icons`, `figcraft-svg`).
   - Level 2 (Structure & Shell): Layout frames, auto-layout hierarchy, responsive containers (`figcraft-use`, `figcraft-generate-design`, `figcraft-mobile-ui`, `figcraft-web-ui`).
   - Level 3 (Optical Polish & States): Concentric radii, surface hairlines, empty/loading/error states (`figcraft-optical-polish`, `figcraft-states-flows`, `figcraft-microcopy`).
   - Level 4 (Interactivity & Motion): Prototype wiring, transitions (`figcraft-prototype`, `figcraft-motion`).
   - Level 5 (Validation & Handoff): Visual QA rubric, reference judge loop, asset export, code connect (`figcraft-audit-design`, `figcraft-visual-acceptance`, `figcraft-design-to-code`, `figcraft-export-assets`).

## 2. Dynamic Subagent Assembly

Select subagents according to task needs:

- **Core Team**:
  - `lead-orchestrator`: Overall pipeline owner and validator.
  - `ui-architect`: Screen geometry, frames, auto-layout containers.
  - `design-system-engineer`: Tokens, variable collections, variant matrices.
  - `frontend-engineer`: Production code synthesis and token binding.
- **Specialized Team (Activated on Demand)**:
  - `mobile-ui-specialist`: Mobile safe areas, status bars, touch targets.
  - `vector-graphics-specialist`: Iconify vector icons, SVG illustrations, mascots.
  - `interaction-motion-engineer`: Prototyping flows, overlay triggers, animation physics.
  - `data-diagram-architect`: Parametric diagrams, Mermaid charts, whiteboards.
  - `automation-script-specialist`: Rhai scripts, bulk transformations, plugins.
  - `asset-exporter`: Multi-scale raster/vector assets, design token files.
- **QA Team**:
  - `visual-qa-auditor`: 100-Point rubric, contrast, auto-layout linting.
  - `independent-acceptance-judge`: Pixel comparison against source reference.

## 3. Execution Pipeline

Execute across synchronized milestones:

1. **Intake Gate**: Audit inputs, ensure FigCraft session is connected via attach or headless mode (`figcraft-files`).
2. **Foundations Gate**: Build design tokens before constructing composite views.
3. **Structural Assembly**: Build screens incrementally; verify via `inspect_document` to prevent overlapping frames.
4. **Surface & Microcopy Pass**: Enforce concentric radii, realistic domain data, zero lorem ipsum.
5. **Interactive Wiring**: Link screens with `proto.action.add`.
6. **Independent Quality Gate**: Run visual screenshot inspection and 100-point rubric. Any defect returns to the responsible subagent with pinpoint coordinates.
7. **Delivery**: Commit `.figcraft` document, export code and assets, report milestone results.

