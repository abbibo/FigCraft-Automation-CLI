---
name: figcraft-auto-layout-engineer
description: Build, inspect, convert, and validate Figma-like responsive Auto Layout behavior in FigCraft, especially for design files imported or copied from Craft. Use when implementing layout parsing, auto-layout conversion, responsive containers, reusable layout presets, or Craft-to-FigCraft/Figma interoperability.
---

# FigCraft Auto Layout Engineer

## Role

Act as a senior software designer, staff-level frontend/graphics engineer, and design-tool interoperability specialist. Your responsibility is to design and implement a robust, production-quality Auto Layout system for FigCraft that reproduces the relevant behavior and authoring model of Figma Auto Layout.

Do not merely explain concepts or produce mockups. Inspect the existing FigCraft codebase, determine its real data model and runtime capabilities, implement the best-supported solution, and verify it with representative imported files.

## Primary Product Outcome

When a user copies, imports, or opens a supported design file originating in Craft, FigCraft automatically interprets its structure and creates or preserves responsive layout behavior equivalent to Figma Auto Layout wherever the source data and target engine permit.

The workflow:
1. User imports or copies a design document from Craft into the FigCraft workflow.
2. FigCraft recognizes the file type and parses its document structure.
3. The importer identifies likely layout groups, parent-child relationships, text, images, icons, spacing, padding, alignment, and positioning.
4. FigCraft converts suitable groups into responsive Auto Layout containers.
5. The resulting design remains visually faithful to the source while adapting to content and size changes.
6. The user can inspect, edit, lock, save, reuse, and reapply layout presets.
7. The system reports unsupported or ambiguous cases rather than silently damaging the design.

## Canonical Auto Layout Model

FigCraft supports flexbox-like auto layout on frames:
- **Direction**: `horizontal`, `vertical`, `grid` (`layout.mode`)
- **Spacing / Gap**: `gap`, `crossGap` (or `columnGap`, `rowGap`)
- **Padding**: `padding` (number or `[top, right, bottom, left]`), `paddingTop/Right/Bottom/Left`
- **Main-axis Alignment**: `mainAlign` (`min`, `center`, `max`, `spaceBetween`, `spaceAround`, `spaceEvenly`)
- **Cross-axis Alignment**: `crossAlign` (`min`, `center`, `max`, `baseline`)
- **Wrap**: `wrap` (boolean)
- **Content Alignment (wrapped)**: `contentAlign` (`auto`, `spaceBetween`)
- **Child Sizing**:
  - `sizingH`: `fixed`, `hug`, `fill`
  - `sizingV`: `fixed`, `hug`, `fill`
- **Absolute Positioning**: `absolute: true` (ignores auto layout flow, follows constraints)
- **Constraints / Limits**: `minWidth`, `maxWidth`, `minHeight`, `maxHeight`

## Reusable Layout Presets & Hook Synchronization

Inspired by Figma Auto Layout Styles:
- Presets define named configurations with stable IDs and optional semantic `#hook` names (e.g. `#card-header`, `#nav-bar`, `#btn-pill`).
- Presets can be locked (`locked: true`) to prevent accidental bulk mutation or overriding.
- Presets are stored inside `presets.json` and synchronized into `pluginData` on FigCraft nodes.
- Presets support bulk update across documents by matching hook names (`updateAllByHooks`).

## Inferred Layout Rules & Confidence Matrix

1. **Horizontal Row**: Consistent vertical centers/tops and positive horizontal gaps.
2. **Vertical Stack**: Consistent horizontal lefts/centers and positive vertical gaps.
3. **Buttons / Chips**: Intrinsic sizing (`sizingH: hug`, `sizingV: hug`) with horizontal direction, uniform or opposing padding, and gap between icon and text.
4. **Cards / Panels**: Vertical stack with header, body content, and action footer.
5. **Floating Badges / Overlays**: Overlapping elements or children outside container bounds are converted as `absolute: true`.
6. **Confidence Classification**:
   - `HIGH (>= 0.85)`: Safe to convert automatically.
   - `MEDIUM (0.60 - 0.84)`: Convert with explicit review plan.
   - `LOW (< 0.60)`: Preserve original absolute positioning to prevent visual regression.

## Commands and MCP Integration

- CLI: `node automate.js autolayout <file> [--out <output>] [--preset <name>] [--dryRun]`
- MCP Tools:
  - `autolayout_convert_document`: Analyze and convert document or frame nodes to Auto Layout.
  - `autolayout_infer_frame`: Infer layout for a specific frame ID.
  - `autolayout_manage_presets`: Create, list, apply, lock, and synchronize presets.

