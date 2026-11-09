---
name: figcraft-typography
description: Establishes typographic scales, downloads and verifies Google Fonts families via font.download, and audits FigCraft documents to eliminate silent font fallbacks. Use when setting font hierarchies, pairing typefaces, loading missing fonts, or auditing text rendering.
---

# FigCraft Typography and Font Management

Typography establishes the tone and reading hierarchy of an interface. This skill manages typeface selection, Google Fonts downloads, and fallback auditing.

## 1. Inspecting Installed and Document Fonts

Before applying a typeface, verify its availability in the FigCraft engine:

1. `run_command` with `"command": "text.fonts"`: Returns every font family available in the local environment.
2. `run_command` with `"command": "file.fontReport"`: Summarizes all font families referenced across the active `.figcraft` document.
3. `run_command` with `"command": "text.missingFonts"`: Identifies any referenced fonts that are not locally installed, indicating whether they can be resolved via Google Fonts.

## 2. Downloading from Google Fonts Store

When a required family is absent, use FigCraft's native font store integration:

1. Check download permission:
   `run_command` with `"command": "font.downloads"`
   Verify that `"allowed": true`. If `"allowed": false`, notify the user that font downloads must be enabled in Text settings, or fall back to an installed system equivalent.
2. Initiate download:
   `run_command` with `"command": "font.download"`, `"params": {"family": "Inter"}`
3. Re-verify document rendering: FigCraft refits open text nodes upon font installation.

## 3. Recommended Font Pairings

Select deliberate pairings tailored to the product personality:

| Product Tone | Heading Font | Body Font | Rationale |
|---|---|---|---|
| Modern SaaS / Tech | Inter / Plus Jakarta Sans | Inter | Crisp legibility at small sizes, neutral tone |
| Developer / Data Tool | JetBrains Mono / Geist | Inter | High numeric contrast, distinct code glyphs |
| Premium / Editorial | Playfair Display / Fraunces | Plus Jakarta Sans | Elegant editorial contrast against modern sans |
| Friendly / Consumer | Fredoka / Quicksand | Nunito | Soft rounded terminals, approachable posture |
| Enterprise / FinTech | Public Sans / Roboto | Public Sans | Dense tabular legibility, formal presentation |

## 4. Typographic Scale and Line Heights

Always pair font sizes with deliberate line-heights:
- Display / Hero: 48px to 64px, `lineHeight: 1.1` to `1.2`
- Page Title (H1): 32px to 40px, `lineHeight: 1.25`
- Section Title (H2): 24px to 28px, `lineHeight: 1.3`
- Subsection (H3): 18px to 20px, `lineHeight: 1.4`
- Body Large: 16px, `lineHeight: 1.5`
- Body Default: 14px, `lineHeight: 1.5`
- Caption / Meta: 12px, `lineHeight: 1.4`

