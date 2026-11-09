---
name: figcraft-icons
description: Discovers and imports authentic vector icons into FigCraft via the Iconify API and curated SVG paths, enforcing single-set visual consistency. Use when adding interface icons, navigation icons, action glyphs, or replacing emoji icons with proper vector paths.
---

# FigCraft Vector Icons

Interface icons must be consistent in weight, grid, and geometry. Never use emojis or hand-sketched approximations for interface controls.

## 1. Icon Sourcing via Iconify API

Search the Iconify API directly to discover verified icon identifiers:

```bash
curl -s "https://api.iconify.design/search?query=search&limit=10"
```

Download the exact SVG payload:

```bash
curl -s "https://api.iconify.design/lucide:search.svg" -o search.svg
```

Import into FigCraft using `file.import` or inject as a vector node.

## 2. Curated 24x24 Vector Paths

For offline or rapid generation, reference `references/vector-icons-24px.md` for standard 24x24 outline vector paths.

Create vector icon nodes directly in `figcraft-use` via `create_node`:
- Type: `"vector"`
- Dimensions: `width: 24`, `height: 24`
- Strokes: `stroke: "#09090B"` (or current theme token), `strokeWeight: 1.5` or `2.0`
- Fills: `[]` (empty for outline glyphs)
- Path data: standard SVG `d` attribute string.

Touch target rule: Always wrap 24x24px icon vectors in a 44x44px or 40x40px auto-layout container frame to ensure touch/click target compliance.

## 3. Strict Single-Family Policy

Choose one icon family per project and maintain it across every screen:

| Visual Character | Recommended Icon Family | Key Characteristics |
|---|---|---|
| Clean, Modern, Balanced | `lucide` | 24px grid, 2px stroke, rounded terminals |
| Technical, High Density | `tabler` | 24px grid, crisp stroke, extensive tech coverage |
| Minimalist, Corporate | `ph` (Phosphor Regular) | Uniform geometry, flexible weight options |
| Google / Android Native | `material-symbols` | Standard 24px grid, Sharp or Rounded variants |
| Filled / High Contrast | `ph` (Phosphor Fill) | Solid shapes for selected navigation states |

Anti-pattern: Never mix outline and solid icons inconsistently in the same navigation bar or toolbar. Active states may use filled variants from the same family if the family provides them.

