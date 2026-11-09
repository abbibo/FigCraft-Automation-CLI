# Standards: Quality Control & Design Rubric

This specification defines the quality control framework, 100-point rubric, defect classification, and independent verification criteria for all FigCraft deliverables.

---

## 1. The 100-Point Industrial Design Critique Rubric

Every design must achieve an overall score of at least **85/100 points** with **zero Critical defects** before being approved for release.

### Category 1: Visual Hierarchy & Squint Test (20 Points)
- **Focal Point (8 pts):** When squinting or applying a 10px Gaussian blur to the screenshot, is there an unmistakable #1 primary element (hero metric / headline) and #1 primary action (CTA)?
- **Typographic Scale Jump (6 pts):** Clear, deliberate jumps between Heading (28–56px Bold/SemiBold), Body (14–16px Regular), and Caption/Meta (12–13px Muted). No adjacent hierarchy levels share identical size + weight + color.
- **Surface Grouping (6 pts):** Related elements are grouped by proximity (gap 8–12px) and separated from unrelated sections by whitespace (gap 32–64px) rather than wrapping every single item in a redundant nested card box.

### Category 2: Layout Geometry & Auto-Layout Integrity (20 Points)
- **Zero Clipping / Collision (8 pts):** No text overflows its parent container, collides with sibling nodes, or breaks awkwardly onto an orphan line.
- **Grid Rhythm & Alignment (6 pts):** All paddings, gaps, and sizes adhere strictly to the 4/8px spatial scale (`4, 8, 12, 16, 20, 24, 32, 48, 64px`). Left edges of stacked content align on common X-coordinates.
- **Safe Area & Viewport Discipline (6 pts):** Mobile screens respect top status bar (54–59px) and bottom home indicator (34px); desktop heroes fit within the initial 900px viewport without pushing CTAs below the fold.

### Category 3: Optical Craft & Color Contrast (20 Points)
- **WCAG AA Contrast (8 pts):** Text meets >= 4.5:1 against its background fill (>= 3:1 for large text $\ge 24\text{px}$); interactive icons and controls meet >= 3:1.
- **Concentric Radii (6 pts):** Nested rounded elements obey $R_{outer} = R_{inner} + \text{Padding}$. No pinched corners ($R_{outer} = R_{inner}$) or sharp interior corners ($R_{inner} = 0$).
- **Surface Elevation Restraint (6 pts):** Dark mode uses surface luminance stepping (`#09090B` -> `#121215` -> `#18181B`) with 1px subtle strokes, never heavy black drop shadows; light mode uses tinted dual-layer ambient + key shadows.

### Category 4: Authenticity & Vector Purity (20 Points)
- **Zero Emoji Icons (7 pts):** All interface glyphs are authentic vector paths (24x24 or 16x16 grid); zero emoji characters used as controls.
- **Single-Family Icon Consistency (7 pts):** Uniform icon set maintained across all screens (e.g. 100% Lucide or 100% Tabler).
- **Layout Diversity (6 pts):** Interface avoids repetitive AI tells (such as repeating identical 3-column card rows across every section).

### Category 5: UX Copy & 5-State Completeness (20 Points)
- **Zero Placeholder Slop (8 pts):** No `Lorem Ipsum`, `John Doe`, `Item 1 / Item 2`, or generic `"Submit"` / `"Learn More"` buttons.
- **Action-Oriented Microcopy (6 pts):** Button labels specify Verb + Object (e.g. `"Transfer $1,250.00"`, `"Create Project"`).
- **5-State Matrix Coverage (6 pts):** Ideal, Empty (with onboarding CTA), Loading Skeleton, Error, and Stress states are fully designed.

---

## 2. Defect Severity Classification

| Severity Level | Definition | Impact on Release | Examples |
|---|---|---|---|
| **CRITICAL** | Severe defect violating platform ergonomics, legibility, or fundamental design rules. | **Release Blocked** (Must be fixed immediately) | Text clipping, WCAG contrast < 3:1, emoji used as UI icon, overlapping top-level frames, missing empty state. |
| **MAJOR** | Noticeable design inconsistency, optical flaw, or minor accessibility deficit. | **Conditional Approval** (Fix required before final release) | Concentric radius violated ($R_{outer} = R_{inner}$), missing tabular numerals on financial numbers, button lacking object in label (`"Next"`). |
| **MINOR** | Subtle aesthetic refinement or polish opportunity. | **Approved** (Can be addressed in next polish cycle) | Spacing off by 2px from 8px grid, secondary icon stroke weight slightly inconsistent, shadow blur slightly high. |

---

## 3. Acceptance Gate Criteria

A project passes the final Quality Gate only when:
1. `visual-qa-auditor` awards an overall score $\ge 85/100$ with **0 Critical defects** and $\le 2$ Major defects.
2. `independent-acceptance-judge` issues a formal `PASS` verdict confirming pixel-level and semantic fidelity against the source reference.
3. `scripts/check_tiling.py` reports zero pixel discrepancies on sliced image exports.
