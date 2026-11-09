# Test Cases: Subagent Verification Scenarios

This document defines realistic, end-to-end test scenarios designed to validate each subagent individually and verify multi-agent orchestration flows across common design engineering tasks.

---

## Scenario 1: Desktop SaaS Analytics Dashboard (Full-Stack Workflow)

### Objective
Verify the end-to-end coordination pipeline from design reference to token creation, auto-layout frame assembly, optical polish, interactive prototype wiring, visual QA audit, and code synthesis.

### Test Workflow
1. **Intake (`lead-orchestrator`):**
   - Inputs: Reference mockup of a modern cloud analytics portal. Target viewport: 1440x900px desktop.
   - Expected Output: Task dependency graph (Tokens -> Icons -> Structure -> Polish -> Prototype -> QA -> Code).
2. **Foundations (`design-system-engineer`):**
   - Download `Inter` and `JetBrains Mono` via `font.download`.
   - Create `Core/Colors` with Light and Dark modes (`#09090B` base, `#121215` card).
   - Expected Output: Verified variable collections and font report without missing fonts.
3. **Vector Assets (`vector-graphics-specialist`):**
   - Query Iconify API for `lucide:layout-dashboard`, `lucide:activity`, `lucide:server`, `lucide:shield`.
   - Wrap icons in 36x36px auto-layout containers.
   - Expected Output: Zero emojis; clean 24px vector nodes.
4. **Layout & 5-States (`ui-architect`):**
   - Construct 1440px desktop frame with 240px sidebar and 12-column content container.
   - Build 4-card KPI row with tabular figures (`$184,290.00`, `99.99% Uptime`).
   - Construct companion Empty State frame with onboarding CTA button.
   - Expected Output: Clean auto-layout hierarchy without text clipping.
5. **Optical Polish Pass (`ui-architect`):**
   - Enforce concentric radii ($R_{outer} = 16\text{px}$, Padding = $8\text{px} \rightarrow R_{inner} = 8\text{px}$).
   - Set 1px specular hairlines (`#27272A`).
6. **Interactivity (`interaction-motion-engineer`):**
   - Wire sidebar nav links to sub-views with 160ms transitions.
   - Wire modal dialog with background scrim and 25% accelerated exit.
7. **Visual QA Gate (`visual-qa-auditor`):**
   - Capture live canvas `screenshot`. Score against 100-Point Rubric.
   - Passing condition: Score >= 85, 0 critical defects.
8. **Independent Release Gate (`independent-acceptance-judge`):**
   - Compare rendered screenshot against source reference image.
   - Passing condition: Formal `PASS` verdict.
9. **Code & Asset Delivery (`frontend-engineer` & `asset-exporter`):**
   - Generate React + Tailwind components (`DashboardShell.tsx`, `MetricCard.tsx`).
   - Export 1x/2x PNG screenshots and `tokens.css`. Save `.figcraft` checkpoint.

---

## Scenario 2: Native Mobile iOS Banking App (Ergonomics & Safe Areas)

### Objective
Validate `mobile-ui-specialist`, platform safe areas, 44pt touch targets, and mobile microcopy.

### Test Workflow
1. **Intake & Frame Setup (`mobile-ui-specialist`):**
   - Select `"iPhone 16"` preset (393x852px).
   - Divide screen into 3 zones: Top Status Bar (54px), Scrollable Content, Bottom Home Bar (34px).
2. **Ergonomics & Touch Targets:**
   - Verify all action buttons and icon buttons have minimum 44x44pt bounding boxes.
   - Position "Transfer Funds" primary CTA in the lower thumb zone.
3. **Microcopy & Data Seeds:**
   - Seed authentic bank accounts (`Checking ...4891: $8,420.50`, `Savings ...9012: $24,190.00`).
   - Action button labeled `"Transfer $250.00 to Savings"`. Zero placeholder text.
4. **Validation:**
   - Visual QA auditor verifies zero safe area collisions and minimum 44pt bounding frames.

---

## Scenario 3: Publication-Grade System Architecture Diagram

### Objective
Validate `data-diagram-architect`, parametric scripting, and export tiling verification.

### Test Workflow
1. **Fact Gathering (`data-diagram-architect`):**
   - Inspect local repository structure: Web Client -> API Gateway -> Auth / Microservices -> PostgreSQL / Redis.
2. **Parametric Scripting:**
   - Declare `GEOMETRY`, `CONTENT`, `STYLE`, `TOPOLOGY` in Python script.
   - Calculate connector endpoints mathematically from node boundaries.
   - Pull back arrowhead tips by 1.5px.
3. **Tiling Verification:**
   - Export 3200x2440px high-resolution PNG using slice rendering.
   - Run `scripts/check_tiling.py` on exported slices.
   - Passing condition: Half-image diff is zero (zero tiling seams).

---

## Scenario 4: Transactional Batch Transformation

### Objective
Validate `automation-script-specialist`, Rhai scripting, and atomic error rollback.

### Test Workflow
1. **Batch Execution:**
   - Execute a Rhai script to find all text nodes using hardcoded `#333333` and re-bind them to variable `color/text/primary`.
2. **Error Injection & Rollback Test:**
   - Inject an intentional runtime exception on step 15.
   - Verify that FigCraft rolls back all previous 14 mutations in a single atomic undo step.
