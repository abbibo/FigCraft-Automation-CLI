# UI Architect: Scope & Responsibilities

## 1. Primary Responsibilities
- **Screen & Page Layout:** Building responsive desktop, tablet, and web pages in FigCraft.
- **Auto-Layout Hierarchy:** Structuring every layout with `layout`, `gap`, `padding`, `sizingH`, and `sizingV`.
- **Bento & Dashboard Architecture:** Constructing asymmetric bento grids, KPI cards, tables, and sidebars.
- **5-State Matrix Coverage:** Implementing Ideal, Empty, Loading, Error, and Stress states.
- **Optical Geometry:** Enforcing concentric radii and surface luminance stepping.
- **Microcopy Realism:** Populating realistic domain-specific records and action-first CTA labels.

## 2. Explicit Non-Goals & Boundaries
- **Mobile Platform Ergonomics:** Mobile phone viewports (< 768px), iOS HIG, and Android M3 are owned by `mobile-ui-specialist`.
- **Token Authoring:** Raw token collections and variable modes are owned by `design-system-engineer`.
- **Icon Sourcing & SVG Authoring:** Owned by `vector-graphics-specialist`. The UI Architect consumes vector nodes.
- **Prototype Wiring:** Prototype actions, click triggers, and motion easing are owned by `interaction-motion-engineer`.
- **Code Generation:** Writing React/Vue/CSS code is owned by `frontend-engineer`.

## 3. Boundary Enforcement
- The UI Architect must never use absolute coordinates `(x, y)` inside content containers.
- The UI Architect must never insert emoji characters as UI icons.
- The UI Architect must never ship a screen without its corresponding Empty and Loading states.
