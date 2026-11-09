---
name: figcraft-optical-polish
description: Enforces studio-grade optical precision, concentric border-radius geometry, surface luminance stepping in dark mode, specular hairlines, and tabular numerals. Use when refining components, polishing cards, modals, or buttons, or resolving amateur and artificial UI defects.
---

# FigCraft Optical Polish and Surface Craft

Eliminates geometric and optical flaws that distinguish amateur or artificial interfaces from studio-grade craftsmanship.

## 1. Concentric Border-Radius Mathematics

Nested rounded containers sharing identical corner radii create an ugly, pinched optical bulge. Compute nested radii using the concentric formula:

R_outer = R_inner + Padding

| Outer Radius (R_outer) | Container Padding (P) | Inner Radius (R_inner) | Target Component Pattern |
|---|---|---|---|
| 24px | 12px | 12px | Outer card to inner media card |
| 20px | 8px | 12px | Modal dialog to action container |
| 16px | 8px | 8px | List item to avatar or badge |
| 14px | 6px | 8px | Button group to active segmented pill |
| 12px | 4px | 8px | Segmented control to active pill tab |

Clamp rule: If (R_outer - P) is less than or equal to 2px, clamp R_inner to 4px. Never use 0px sharp corners inside a rounded parent.

## 2. Surface Elevation and Hairlines

### Dark Mode: Luminance Stepping
Drop shadows are ineffective on dark canvas fills (#09090B). In dark mode, express elevation by stepping surface luminance upward combined with subtle 1px specular border highlights:

- Level 0 (Canvas Base): #09090B
- Level 1 (Card / Sidebar / Panel): #121215 with 1px stroke #27272A (#FFFFFF12)
- Level 2 (Elevated Modal / Active Card): #18181B with 1px stroke #3F3F46 (#FFFFFF1F)
- Level 3 (Floating Command Palette / Popover): #27272A with 1px stroke #52525B

### Light Mode: Multi-Layer Tinted Elevation
Avoid harsh single-layer black shadows. Combine a 1px subtle stroke (#09090B0F) with a dual-layer ambient and key drop shadow:
- Ambient shadow: Y: 1px, Blur: 2px, Color: #09090B08
- Key shadow: Y: 4px, Blur: 12px, Color: #09090B12

## 3. Tabular Numerals and Text Alignment

1. **Tabular Figures**: For currency amounts, metric counters, timers, stock prices, and tabular data, specify tabular figures in font settings so numbers maintain fixed column widths.
2. **Optical Centering**: Icons inside circular or pill action buttons must be optically centered, accounting for glyph visual weight.
3. **Hairline Dividers**: Use 1px borders with muted alpha fills (6% to 12% opacity) rather than heavy solid gray lines.

