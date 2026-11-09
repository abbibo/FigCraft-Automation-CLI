# Shared Operating Principles & Universal Invariants

These invariants apply universally to **all subagents** operating within the FigCraft Multi-Agent System. No subagent is permitted to bypass these rules.

---

## 1. Engine & Coordinate Discipline

1. **Non-Overlapping Frame Placement:**
   - Top-level screen frames must never overlap at `(0, 0)`.
   - Always place sequential screen frames horizontally along the X-axis:
     $$\text{Frame}_{n}.x = \text{Frame}_{n-1}.x + \text{Frame}_{n-1}.\text{width} + 80\text{px}$$
   - Place companion error/empty frames vertically beneath the primary frame:
     $$\text{Frame}_{\text{companion}}.y = \text{Frame}_{\text{primary}}.y + \text{Frame}_{\text{primary}}.\text{height} + 100\text{px}$$
2. **Auto-Layout Exclusivity:**
   - Never use manual absolute positioning (`x`, `y`) inside screen content sections.
   - Always structure layouts using `layout: "vertical"` or `"horizontal"`, setting explicit `gap`, `padding`, `sizingH` (`"hug"` or `"fill"`), and `sizingV` (`"hug"` or `"fill"`).
3. **Atomic `batch` Construction:**
   - Related node operations must be grouped into a single `batch` command envelope using `{"$step": n}` parent references to preserve single-step undo.

---

## 2. Optical Craft & Surface Invariants

1. **Concentric Border-Radius Formula:**
   Nested rounded containers must satisfy:
   $$R_{\text{outer}} = R_{\text{inner}} + \text{Padding}$$
   - Example: Card with `cornerRadius: 16` and `padding: 8` requires inner child elements to have `cornerRadius: 8`.
   - Clamp rule: If $R_{\text{outer}} - \text{Padding} \le 2\text{px}$, clamp $R_{\text{inner}}$ to `4px`. Never use sharp `0px` corners inside a rounded container.
2. **Surface Luminance Stepping (Dark Mode):**
   Drop shadows are invisible on dark backgrounds (`#09090B`). Communicate elevation through surface luminance stepping combined with a `1px` subtle stroke:
   - Level 0 (Canvas Base): `#09090B`
   - Level 1 (Card / Sidebar): `#121215` with `1px` stroke `#27272A`
   - Level 2 (Elevated Modal / Active Card): `#18181B` with `1px` stroke `#3F3F46`
   - Level 3 (Floating Command Palette / Popover): `#27272A` with `1px` stroke `#52525B`
3. **Multi-Layer Tinted Elevation (Light Mode):**
   Combine a `1px` subtle stroke (`#09090B0F`) with dual-layer ambient and key shadows. Never use single harsh black shadows (`rgba(0,0,0,0.25)`).
4. **Tabular Numerals:**
   All currency values, metrics, percentages, timers, and data table columns must specify tabular numerals (`tabular-nums`) to prevent optical jitter.

---

## 3. Vector Purity & Icon Discipline

1. **Strict Zero-Emoji Rule:**
   - Emojis (`🏠`, `⚙️`, `🔔`, `🚀`) are strictly prohibited as UI icons.
   - All interface glyphs must be proper vector paths (`24×24` or `16×16` grid) sourced from the **Iconify API** or `references/vector-icons-24px.md`.
2. **Single-Family Consistency:**
   - Maintain one icon family across the entire file (`lucide`, `tabler`, or `ph`).
   - Mixing rounded outline icons with sharp filled icons in the same navigation bar is a critical defect.
3. **Touch Target Containers:**
   - Always wrap `24×24px` icon vector paths inside a minimum `44×44px` (iOS) or `48×48px` (Android) auto-layout container frame.

---

## 4. UX Content & State Completeness

1. **Zero-Placeholder Policy:**
   - Strictly banned: `Lorem ipsum`, `Dolor sit amet`, `John Doe`, `Jane Doe`, `User 1`, `Item 1 / Item 2`, `Card Title`.
   - Strictly banned: generic buttons labeled `"Submit"`, `"Click Here"`, or `"Learn More"`.
   - Microcopy must be domain-specific and action-oriented (e.g. `"Transfer $1,250.00"`, `"Deploy to Production"`).
2. **The 5-State Matrix Mandate:**
   Every data container, list, or dashboard view must include designs for:
   - **Ideal:** Populated with varied string lengths and realistic numbers.
   - **Empty:** Centered empty-state illustration/badge, benefit explanation, and primary onboarding CTA.
   - **Loading:** Geometry-matched skeleton placeholders with identical heights to prevent layout shift.
   - **Error:** Inline input error message or non-fatal dismissible banner with retry CTA.
   - **Stress:** Extreme overflow testing (long names, large currencies, multiline badges).

---

## 5. Mobile Platform Ergonomics

1. **Hardware Safe Area Clearances:**
   - **iOS:** Reserve top `59px` (Dynamic Island / Status Bar) and bottom `34px` (Home Indicator).
   - **Android:** Reserve top `36dp` (Status Bar) and bottom `24dp` (Gesture Bar).
2. **Thumb-Zone Optimization:**
   - Primary action buttons, tab bars, and sticky triggers must reside within the lower one-third thumb-reach zone.
