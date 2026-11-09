---
name: figcraft-states-flows
description: Designs complete 5-state UI matrices including ideal, empty, skeleton loading, error, and stress overflow states, along with multi-step interactive user flows. Use when architecting product screens, designing resilient component states, or preventing happy-path-only interfaces.
---

# FigCraft UX Flows, Edge Cases, and 5-State Completeness

Prevents interfaces from shipping with only the happy path. Industrial design requires every data lifecycle state and user transition to be accounted for.

## 1. The Mandatory 5-State Data Matrix

When designing any data-driven screen, list, table, or card, produce representations for the 5 fundamental lifecycle states:

1. **Ideal State (Populated)**:
   - Realistic length variation (short and long user names, multi-line titles, realistic currency formats).
   - Varied status badges (active, pending, suspended).
2. **Empty State (Zero-Data)**:
   - Centered container with maximum width of 360px.
   - Tinted 40x40px vector icon badge or subtle monochrome illustration.
   - Clear explanatory headline and one-sentence value proposition.
   - Primary onboarding call to action (e.g. "+ Create First Project").
3. **Loading State (Skeleton)**:
   - Geometry-matched skeleton placeholders matching the exact height, width, and corner radii of final text blocks and avatars.
   - Prevents Cumulative Layout Shift (CLS = 0).
4. **Error and Offline State**:
   - Field-level: 1px red stroke (#EF4444) plus warning icon and actionable message 6px beneath the input.
   - Section-level: Tinted alert banner (#EF444414 fill, #EF444440 stroke) with retry CTA button while preserving surrounding UI.
5. **Stress and Overflow State**:
   - Extended strings (e.g. international names with 40+ characters).
   - High-magnitude numerical figures (e.g. $14,850,290.00).
   - Text wrapping rules (wrap: true) and truncation safety on badges and table cells.

## 2. Interactive Component State Matrix

Every interactive component (buttons, inputs, dropdowns, list rows, tabs) must specify tokens across 5 interaction states:

- **Default**: Base background fill, resting hairline border, WCAG AA contrast (>= 4.5:1).
- **Hover**: Subtle luminance shift (+6% in dark mode, -4% in light mode) or border emphasis.
- **Focus-Visible**: High-contrast 2px focus ring with 2px offset.
- **Active / Pressed**: 1px downward translation or subtle scale compression (0.98).
- **Disabled**: Reduced opacity (40% to 50%) or muted semantic fill with disabled cursor.

## 3. Multi-Screen Flow Ergonomics

When designing a user journey:

1. Place screens horizontally from left to right in chronological sequence with an 80px horizontal gap.
2. Align companion empty or error states vertically beneath the corresponding primary screen with a 100px vertical gap.
3. Connect trigger elements to destination screens using `figcraft-prototype` actions for instant validation.

