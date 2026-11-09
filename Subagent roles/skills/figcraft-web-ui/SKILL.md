---
name: figcraft-web-ui
description: Designs desktop web interfaces, landing pages, marketing websites, and SaaS dashboards in FigCraft with 12-column grids, Bento layouts, and responsive containers. Use when designing web applications, admin portals, landing pages, or desktop screens in FigCraft.
---

# FigCraft Web, Landing Page, and Dashboard Specialist

Builds high-caliber desktop web interfaces, landing pages, and SaaS dashboards directly on the FigCraft canvas.

## 1. Frame Setup and Responsive Grids

1. **Desktop Frame Dimensions**: Use `frame.create` with preset `"Desktop"` (1440px width) and vertical auto-layout.
2. **Container Constraints**: Inside full-bleed 1440px sections, constrain interior content containers to 1200px or 1280px width (`padding: [80, 120, 80, 120]` for marketing sections; `padding: [24, 32, 24, 32]` for data dashboards).
3. **12-Column Grid Rhythm**: Attach a layout grid via `grid.add` with 12 columns, 24px gutter, and 120px margin for structural alignment.

## 2. Marketing and Landing Page Architecture

- **Global Navigation Bar**:
  - Single horizontal bar, height 64px to 72px, `mainAlign: "spaceBetween"`, `crossAlign: "center"`.
  - Brand mark on left, 3 to 5 clear navigation links in center, primary action CTA button on right.
- **Hero Section**:
  - Must fit cleanly inside the initial 900px viewport height without pushing CTAs below the fold.
  - Structure: Eyebrow pill tag, headline (48px-64px, maximum 2 lines), subhead (18px, maximum 3 lines), and dual CTA button row.
  - Split Hero: Left copy stack (600px width) and right interactive product preview illustration or card stack (600px width).
- **Bento Grid Architecture**:
  - Feature highlights structured in asymmetric multi-column grids (e.g. 2 large 6-column cards on row 1; 3 4-column cards on row 2).
  - Every card utilizes concentric radii, subtle 1px border stroke, and dedicated icon badge.

## 3. SaaS Dashboard and Admin Anatomy

- **Two-Column Dashboard Shell**:
  - Left navigation sidebar: Fixed 240px to 280px width, vertical auto layout, workspace switcher, categorized navigation links, user profile pill at bottom.
  - Right content pane: `sizingH: "fill"`, `sizingV: "fill"`, top header bar (search, notifications, status, action button), followed by metric card grid and primary data tables.
- **Metric Cards (KPIs)**:
  - 4-card horizontal row (`sizingH: "fill"` each), containing label, primary numerical metric (tabular figures), trend delta chip (+12.4%), and mini sparkline or icon badge.
- **Data Table Layouts**:
  - Header row with subtle background fill, sortable column titles, checkbox selection, and consistent cell padding (`padding: [12, 16, 12, 16]`).

