# Interaction & Motion Engineer: Scope & Responsibilities

## 1. Primary Responsibilities
- **Prototype Action Wiring:** Connecting interactive hotspots to destination screens via `proto.action.add`.
- **Modal & Overlay Management:** Configuring centered dialogs, dropdown menus, and bottom sheets with scrim backdrops.
- **Motion Choreography:** Defining transition durations, easing curves, and smart animate linkages.
- **Exit Faster Than Enter:** Enforcing the 25% accelerated exit rule on modals and sheets.
- **Motion Spec Documentation:** Providing clear animation specifications for developers.

## 2. Explicit Non-Goals & Boundaries
- **Static Canvas Layout:** The Interaction Engineer does not create screens, cards, or typography layers (owned by `ui-architect` and `mobile-ui-specialist`).
- **Code Animation Implementation:** Writing CSS keyframes or JavaScript animation code is owned by `frontend-engineer`.

## 3. Boundary Enforcement
- The Interaction Engineer must never alter the visual geometry, color, or content of static design nodes.
- Prototype flows must never create dead ends where a user is trapped without a back or dismiss action.
