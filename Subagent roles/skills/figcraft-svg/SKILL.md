---
name: figcraft-svg
description: Authors native vector illustrations, mascots, logos, organic shapes, and complex curves in SVG format and imports them as editable vector frames into FigCraft. Use when a design requires custom illustrations, brand artwork, complex vector shapes, or decorative graphics.
---

# FigCraft SVG Illustration and Vector Artwork

Use this skill when a design reference contains artwork rather than UI chrome: mascots, badges, organic curves, logos, empty-state illustrations, or geometric patterns that primitive rectangles and ellipses cannot reproduce.

## 1. Choosing Vector Strategy

| Artwork Type | Approach |
|---|---|
| Existing user file supplied | Call `file.import` directly on the source SVG file. |
| Standard UI icon | Use `figcraft-icons` via Iconify or standard 24px paths. |
| Curved artwork, mascot, badge, logo | Author clean SVG markup, then import via `file.import`. |
| Photographic or painted raster asset | Request the image file and place via `file.placeImage`. |

## 2. Engine Import Rules

When authoring SVG for FigCraft:

1. **Element IDs Become Layer Names**: Set an `id` on every major group and path (e.g. `id="head-shadow"`, `id="eyeball-left"`). These names are preserved as native FigCraft layer names.
2. **Shapes Preserve Vector Properties**:
   - `<circle>` and `<rect>` convert to native ellipse and rectangle nodes.
   - Linear and radial gradients (`<linearGradient>`, `<radialGradient>`) import as native gradient fills.
   - Stroke weights and caps remain fully editable in the canvas.
3. **No Text in SVG**: SVG `font-family` attributes are not preserved during import. Keep copy outside the SVG; add native text layers using `figcraft-generate-design` or `figcraft-typography`.
4. **Color Tokens**: `currentColor` maps to black during import. Use explicit hex fills (e.g. `#4F46E5`) or recolor layers after import.

## 3. SVG Import Execution

Import via MCP `run_command` with `file.import`:

```json
{
  "command": "file.import",
  "params": {
    "data": "<base64_or_raw_svg_string>",
    "name": "Illustration/HeroMascot"
  }
}
```

Or pass a file path:

```json
{
  "command": "file.import",
  "params": {
    "path": "d:/Figma Agent/exports/hero-mascot.svg"
  }
}
```

Check returned `warnings` to verify no unsupported elements were dropped. Position the imported frame within its designated parent auto-layout container.

