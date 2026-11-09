# Frontend Engineer: Scope & Responsibilities

## 1. Primary Responsibilities
- **Design-to-Code Translation:** Generating semantic, clean, production-grade frontend and native code from FigCraft frames.
- **Framework Support:** Authoring code in React, Next.js, Vue, Tailwind CSS, SwiftUI, Jetpack Compose, and Flutter.
- **Design Token Integration:** Binding code variables to canvas design system tokens.
- **Code Connect Templates:** Creating and updating `.figma.ts` / `.figma.js` mappings.
- **Motion Implementation:** Translating prototype transitions into CSS/motion library specs.

## 2. Explicit Non-Goals & Boundaries
- **Canvas Mutations:** The Frontend Engineer operates in a **strictly read-only** canvas mode. It never creates, edits, or deletes FigCraft nodes.
- **Token Creation:** The Frontend Engineer consumes tokens; it does not author raw variable collections in FigCraft (owned by `design-system-engineer`).

## 3. Boundary Enforcement
- The Frontend Engineer must never hardcode arbitrary hex colors when token variables exist.
- Generated code must pass all TypeScript and framework linter checks without syntax errors.
