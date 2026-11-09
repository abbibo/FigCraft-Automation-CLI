# Standards: Naming Conventions & Taxonomy

This document establishes the official naming taxonomy across all FigCraft canvas nodes, design tokens, component variants, and code export files.

---

## 1. Canvas Layer & Frame Hierarchy

All canvas nodes must follow semantic slash notation (`Category/Subcategory/Identifier`):

| Node Type | Naming Format | Examples | Anti-Patterns (Banned) |
|---|---|---|---|
| **Top-Level Screen** | `Screen/<RouteOrName>` | `Screen/Home`, `Screen/Dashboard/Analytics` | `Frame 1`, `Untitled`, `Screen1` |
| **Companion 5-State**| `Screen/<Name>/<State>` | `Screen/Home/Empty`, `Screen/Home/Loading` | `Frame 1 copy`, `EmptyState` |
| **Major Page Section**| `Section/<Purpose>` | `Section/Hero`, `Section/BentoGrid`, `Section/KPIs` | `Group 42`, `Section` |
| **Header / Nav** | `Header/<Scope>` | `Header/GlobalNav`, `Header/PageHeader` | `Navbar`, `top-bar` |
| **Card Container** | `Card/<EntityType>` | `Card/Metric/ARR`, `Card/Product/AeroMesh` | `Rectangle 12`, `Box` |
| **Atomic Button** | `Button/<Variant>/<State>`| `Button/Primary/Default`, `Button/Ghost/Hover` | `Btn`, `Frame 8` |
| **Input Field** | `Input/<FieldType>/<State>`| `Input/Email/Default`, `Input/Password/Error` | `TextBox`, `Text` |
| **Icon Container** | `Icon/<Family>/<Glyph>` | `Icon/Lucide/CreditCard`, `Icon/Tabler/Settings` | `Vector`, `Icon`, `Emoji` |
| **Modal / Dialog** | `Modal/<DialogType>` | `Modal/ConfirmDelete`, `Modal/InviteTeam` | `Popup`, `Dialog 2` |

---

## 2. Design Token & Variable Conventions

Variable collections must follow lowercase kebab-case or slash-path semantics:

### A. Color Tokens (`Core/Colors`)
- Surface base: `color/surface/base` (#09090B dark / #FFFFFF light)
- Surface card: `color/surface/card` (#121215 dark / #FFFFFF light)
- Surface elevated: `color/surface/elevated` (#18181B dark / #F4F4F5 light)
- Surface stroke: `color/surface/stroke` (#27272A dark / #09090B0F light)
- Text primary: `color/text/primary` (#FAFAFA dark / #09090B light)
- Text muted: `color/text/muted` (#A1A1AA dark / #71717A light)
- Brand primary: `color/brand/primary`
- Semantic status: `color/status/success`, `color/status/warning`, `color/status/error`, `color/status/info`

### B. Spacing & Sizing Tokens (`Core/Spacing`)
Must sit strictly on the 4/8px spatial scale:
- `spacing/4` (4px), `spacing/8` (8px), `spacing/12` (12px), `spacing/16` (16px), `spacing/20` (20px), `spacing/24` (24px), `spacing/32` (32px), `spacing/48` (48px), `spacing/64` (64px).

### C. Corner Radius Tokens (`Core/Radii`)
- `radius/sm` (4px), `radius/md` (8px), `radius/lg` (12px), `radius/xl` (16px), `radius/2xl` (20px), `radius/3xl` (24px), `radius/full` (9999px).

---

## 3. Component Variant Property Taxonomy

When constructing master components with variants, use standardized lowercase property keys:

```
Button:
  variant: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size:    "sm" | "md" | "lg"
  state:   "default" | "hover" | "pressed" | "disabled"
  hasIcon: true | false

Input:
  size:    "sm" | "md"
  state:   "default" | "focused" | "error" | "disabled"
  hasIcon: true | false
```

---

## 4. Code Export File Naming

Generated code files must use standard developer naming conventions:
- React / Next.js Components: PascalCase (e.g. `DashboardCard.tsx`, `NavigationHeader.tsx`).
- Utility & Helper Scripts: kebab-case (e.g. `format-currency.ts`, `check-tiling.py`).
- Style & Token Files: kebab-case (e.g. `tokens.css`, `tailwind.config.js`).
- Native Mobile Views: PascalCase (e.g. `HomeScreen.swift`, `ProductDetailView.kt`).
