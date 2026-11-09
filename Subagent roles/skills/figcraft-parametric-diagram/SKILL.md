---
name: figcraft-parametric-diagram
description: Generates editable, script-driven technical architecture diagrams, system topologies, and publication figures from parametric code definitions. Use when creating complex architecture diagrams, multi-layer network topologies, data pipelines, or reproducible technical figures.
---

# FigCraft Parametric Diagrams and Architecture Schemas

Draws reproducible, maintainable structure diagrams and system architectures where a script acts as the single source of truth.

## 1. Script-Driven Diagram Architecture

When diagramming complex systems, declare four distinct blocks:

1. `GEOMETRY`: Columns, row heights, container dimensions, and margins.
2. `CONTENT`: Node titles, subtitles, technical badges, and port labels.
3. `STYLE`: Semantic color palettes, stroke weights, corner radii, and typographic tokens.
4. `TOPOLOGY`: Directional edges, caller-callee linkages, data streams, and boundaries.

Generating or updating the diagram requires only modifying the declaration block and re-running the script, rather than manually recalculating pixel coordinates.

## 2. Geometry Calculation Rules

- **Connector Endpoints**: Derive line start and end coordinates mathematically from node boundaries (`center +/- radius` or box edge midpoints). Never use hardcoded arbitrary offsets.
- **Directional Clusters**: For fan-in or converging topologies, attach incoming lines to a single designated node boundary pole with uniform spacing.
- **Arrow Markers**: Size arrowheads proportionally to line thickness. Pull back marker endpoints by 1.5px to 2px so the tip touches the target boundary without overlapping.
- **Z-Ordering**: Draw boundary groups and background swimlanes first, followed by connection lines, followed by node cards, and finally text and badge labels on top.

## 3. Workflow Integration

1. Review project source code or architectural documentation to extract real boundaries, services, databases, and message buses.
2. Select diagram path:
   - For rapid vector generation in FigCraft: use `figcraft-diagram` with Mermaid syntax.
   - For publication-grade or parametric figures: generate parametric SVG and import via `figcraft-svg`.
   - For interactive whiteboard sessions: construct canvas cards and connectors using `figcraft-boards`.
3. Verify visual alignment and label readability using `figcraft-visual-acceptance`.
