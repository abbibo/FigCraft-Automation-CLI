# Multi-Agent Hierarchy & Organizational Architecture

## 1. Executive Structure & Authority Tiers

The FigCraft Multi-Agent System operates under a four-tier hierarchical governance model designed to maximize domain specialization, eliminate execution conflicts, and enforce independent quality gates.

```
+──────────────────────────────────────────────────────────────────────────+
│                     TIER 1: SYSTEM ORCHESTRATION                         │
│                           lead-orchestrator                              │
│       (Intake, Dependency Scheduling, Agent Assembly, Final Gate)        │
+──────────────────────────────────────────────────────────────────────────+
                                      │
          ┌───────────────────────────┴───────────────────────────┐
          ▼                                                       ▼
+───────────────────────────────────+   +───────────────────────────────────+
│       TIER 2: CORE DESIGN         │   │     TIER 3: SPECIALIZED CRAFT     │
│       & ENGINEERING AGENTS        │   │           AGENTS                  │
│                                   │   │                                   │
│ • ui-architect                    │   │ • mobile-ui-specialist            │
│   (Screen layouts, auto layout)   │   │   (iOS HIG, MD3, safe areas)      │
│ • design-system-engineer          │   │ • vector-graphics-specialist      │
│   (Tokens, variables, fonts)      │   │   (Iconify API, SVG mascots)      │
│ • frontend-engineer               │   │ • interaction-motion-engineer     │
│   (Code generation, Code Connect) │   │   (Prototypes, smart animate)     │
│                                   │   │ • data-diagram-architect          │
│                                   │   │   (Parametric diagrams, Mermaid)  │
│                                   │   │ • automation-script-specialist    │
│                                   │   │   (Rhai scripts, WASM plugins)    │
│                                   │   │ • asset-exporter                  │
│                                   │   │   (Multi-scale PNG/SVG, tokens)   │
+───────────────────────────────────+   +───────────────────────────────────+
                  │                                       │
                  └───────────────────┬───────────────────┘
                                      ▼
+──────────────────────────────────────────────────────────────────────────+
│                     TIER 4: QUALITY ASSURANCE & GATING                   │
│                                                                          │
│ • visual-qa-auditor (100-Point Rubric, WCAG AA contrast, optical audit)   │
│ • independent-acceptance-judge (Pixel diff vs reference, release gate)  │
+──────────────────────────────────────────────────────────────────────────+
```

---

## 2. Authority Levels & Delegation Powers

### Level 1: System Orchestrator (`lead-orchestrator`)
- **Authority:** Full authority over task decomposition, schedule sequencing, subagent recruitment, task assignment, and milestone approval.
- **Reporting:** Reports directly to the User / Client.
- **Veto Power:** Can reject any subagent output that violates requirements, schedules, or architectural standards.

### Level 2: Core Domain Leads (`ui-architect`, `design-system-engineer`, `frontend-engineer`)
- **Authority:** Autonomous decision-making within their technical domain.
  - `design-system-engineer` dictates semantic tokens, Light/Dark color variables, typography scales, and concentric corner radius math.
  - `ui-architect` dictates canvas layout hierarchy, auto-layout constraints, 12-column grids, and 5-state matrices.
  - `frontend-engineer` dictates framework structure (React/Next.js/SwiftUI/Flutter), component prop types, and Code Connect mappings.
- **Subordination:** Must comply with foundations established by Level 2 peers (e.g., `ui-architect` must use variables created by `design-system-engineer`).

### Level 3: Specialized Task Specialists
- **Authority:** Execution autonomy for discrete specialized deliverables (icons, mobile safe areas, prototypes, parametric diagrams, Rhai scripts, asset exports).
- **Subordination:** Operates under direct specifications dispatched by `lead-orchestrator`, adhering strictly to Level 2 foundations.

### Level 4: Quality Assurance & Independent Judges
- **Authority:** Independent verification authority. 
  - `visual-qa-auditor` can fail any design scoring below 85/100 on the Design Rubric.
  - `independent-acceptance-judge` holds release gate veto power. If pixel diff or semantic criteria fail against the reference design, delivery is blocked.
- **Independence:** QA agents cannot modify production frames directly; they issue formal defect logs with coordinate locations and assign remediation back to the originating subagent.

---

## 3. Escalation & Conflict Resolution Hierarchy

When cross-agent conflicts occur, resolution follows this fixed protocol:

1. **Token vs. Hardcoded Value Conflict:** `design-system-engineer` always supersedes. Literal hex colors are converted to variable references.
2. **Layout Overlap vs. Content Volume Conflict:** `ui-architect` adjusts container auto-layout (`layout: vertical`, `wrap: true`, or scroll tracks). Content is not arbitrarily deleted.
3. **Desktop vs. Mobile Ergonomics Conflict:** `mobile-ui-specialist` has absolute authority over mobile screen frames (393px width, safe areas, 44pt touch targets); `ui-architect` defers on mobile viewports.
4. **Architectural Gridlock:** When two subagents disagree on layout or implementation tradeoffs, dispute escalates immediately to `lead-orchestrator` for binding arbitration based on the user's primary objective.
