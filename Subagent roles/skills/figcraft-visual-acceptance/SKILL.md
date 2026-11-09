---
name: figcraft-visual-acceptance
description: Executes pre-delivery visual acceptance audits, comparing rendered screenshots against reference designs, evaluating 100-point rubric criteria, and verifying export tiling fidelity. Use when validating finished screens, performing regression checks, comparing designs against references, or enforcing release gates.
---

# FigCraft Visual Acceptance and Independent Judge Loop

Delivery quality is determined by objective visual verification, comparing the live canvas render directly against the original design reference and passing a formal quality gate.

## 1. The Three Acceptance Gates

Before declaring any design task complete:

1. **Live Canvas Screenshot**:
   - Call `view.zoomFit` or focus on the target frame.
   - Capture a canvas screenshot via `screenshot` tool to inspect the rendered layout in context.
   - Do not rely solely on inspecting node properties; visual collisions and clipping only appear in rendered bitmaps.
2. **Export Integrity and Tiling Verification**:
   - For high-resolution exports (2x or 3x PNG), run `scripts/check_tiling.py` on exported slices to ensure no tiling seams, stitching gaps, or clipped content exist.
3. **Independent Judge Verification**:
   - Dispatch an objective review evaluating the rendered screenshot against the original reference image or approved PRD requirements.
   - Produce a structured PASS or FAIL verdict.

## 2. 100-Point Design Quality Rubric

Grade the interface across 5 categories (20 points each). Minimum passing score is 85/100:

1. **Visual Hierarchy and Squint Test (20 pts)**:
   - Primary focal point and CTA are immediately identifiable upon blurring or squinting.
   - Clear size and weight distinctions between headings, body, and metadata.
   - Proper section grouping via whitespace rather than excessive card boxing.
2. **Layout Geometry and Auto-Layout Integrity (20 pts)**:
   - Zero text clipping, awkward word wrapping, or overlapping elements.
   - Strict 4/8px spatial scale alignment across paddings, margins, and gaps.
   - Adherence to device safe areas and viewport limits.
3. **Optical Craft and Contrast (20 pts)**:
   - WCAG AA contrast compliance: text >= 4.5:1, controls/icons >= 3:1.
   - Concentric corner radii: R_outer = R_inner + Padding.
   - Refined 1px specular borders and surface luminance stepping in dark mode.
4. **Authenticity and Craft (20 pts)**:
   - Clean vector icons; zero emoji icons.
   - Thoughtful layout variety rather than repeating identical card templates.
5. **Microcopy and State Completeness (20 pts)**:
   - Zero Lorem Ipsum or placeholder copy.
   - Action-oriented button labels and domain-realistic content seeds.

## 3. Corrective Task Dispatch

When the verdict is FAIL:
- Document each issue with severity (Critical, Major, Minor), exact element name, coordinate location, and required corrective action.
- Route the fix back to the responsible subagent (`ui-architect`, `design-system-engineer`, etc.).
- Re-run the visual acceptance loop until a PASS verdict is achieved.

