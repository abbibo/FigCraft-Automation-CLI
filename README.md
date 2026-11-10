# FigCraft Automation CLI

Command-line toolkit for automating **FigCraft** design tasks in headless or live-attached mode. Instantly scaffold UI cards, color palettes, and navigation bars. Batch-export all frames as PNG, SVG, or PDF. Run custom multi-step workflows from JSON files. Supports dark/light theming and auto-layout.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Dual Mode** | Automatically detects whether FigCraft desktop is running — connects in **Attached Mode** (live canvas on port 47800) or falls back to **Headless Mode** (in-process engine). |
| **UI Card Generator** | Scaffold styled cards with title, description, CTA button, optional badge, auto-layout, and dark/light theming. |
| **Color Palette** | Generate design-token swatch grids with labeled hex values. |
| **Navbar Scaffold** | Create responsive navigation headers with brand, links, and CTA. |
| **Batch Export** | Export every top-level frame on the canvas as PNG, SVG, PDF, or WebP at any scale. |
| **JSON Workflows** | Define multi-step automation pipelines in a JSON file and execute them with a single command. |
| **MCP Proxy Server** | Extended MCP server proxy that adds high-level composite tools on top of native FigCraft commands. |
| **Auto Layout Engine** | Parse, infer, convert, and validate Figma-like responsive Auto Layout on static designs (.figcraft, .json, .fig, .sketch) with reusable presets and #hook synchronization. |
| **WASM Plugin** | Includes a sample Rust → WebAssembly plugin for generating palette swatch grids directly inside FigCraft. |
| **Subagent System** | A full multi-agent orchestration framework with 13 specialized roles for AI-driven design workflows. |

---

## 📁 Project Structure

```
FigCraft-Automation-CLI/
├── automate.js                  # Main CLI — card, palette, navbar, export, run
├── figcraft-auto.js             # Extended MCP proxy with composite tools
├── execute_figcraft_task.js     # Universal task executor (auto mode detection)
├── sample_workflow.json         # Example JSON workflow file
├── start_figcraft.bat           # Launch FigCraft desktop in attached mode
├── switch_to_attached.bat       # Switch to attached mode
├── switch_to_headless.bat       # Switch to headless mode
├── test_figcraft_mode.bat       # Test which mode is active
├── .gitignore
│
├── plugins/
│   └── palette-swatch-grid/     # Sample WASM plugin (Rust)
│       ├── figcraft-plugin.json
│       ├── Cargo.toml
│       ├── src/lib.rs
│       ├── build.bat
│       └── README.md
│
└── Subagent roles/              # Multi-agent orchestration framework
    ├── roles/                   # 12 specialist role definitions
    ├── subagents/               # Per-agent instructions & I/O specs
    ├── skills/                  # 20+ FigCraft skill modules
    ├── core/                    # Orchestrator & shared instructions
    ├── architecture/            # System design docs
    ├── standards/               # Naming, output & QA standards
    ├── scripts/                 # Validation & utility scripts
    └── testing/                 # Test cases & validation reports
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [FigCraft Desktop](https://artcraft.dev/figcraft) installed at the default path
- *(Optional)* Rust toolchain for building the WASM plugin

### Run the CLI

```bash
node automate.js --help
```

### Launch FigCraft in Attached Mode

```bash
start_figcraft.bat
```

This opens FigCraft with the control server on port **47800**, enabling live canvas sync.

---

## 📖 CLI Commands

### `card` — Scaffold a UI Card

```bash
node automate.js card --title "Welcome" --desc "Get started with FigCraft" --btn "Learn More" --tag "NEW" --dark
```

| Flag | Default | Description |
|------|---------|-------------|
| `--title` | `Welcome to FigCraft` | Card heading |
| `--desc` | *(auto)* | Card body text |
| `--btn` | `Get Started` | Button label |
| `--tag` | *(none)* | Optional pill badge text |
| `--dark` | `false` | Dark theme |
| `--width` | `340` | Card width in px |
| `--x`, `--y` | `100, 100` | Canvas position |

### `palette` — Generate a Color Palette

```bash
node automate.js palette --name "Brand Colors" --colors "#0F172A,#3B82F6,#10B981,#F59E0B"
```

| Flag | Default | Description |
|------|---------|-------------|
| `--name` | `Brand Design Tokens` | Palette title |
| `--colors` | 6 default colors | Comma-separated hex values |
| `--x`, `--y` | `100, 100` | Canvas position |

### `navbar` — Scaffold a Navigation Bar

```bash
node automate.js navbar --brand "Acme" --links "Features,Docs,Pricing" --cta "Sign Up" --dark
```

| Flag | Default | Description |
|------|---------|-------------|
| `--brand` | `Acme` | Brand name |
| `--links` | `Features,Solutions,Docs,Pricing` | Nav links |
| `--cta` | `Get Started` | CTA button text |
| `--dark` | `false` | Dark theme |
| `--width` | `1140` | Navbar width in px |

### `export` — Batch Export All Frames

```bash
node automate.js export --out "./exports" --format svg --scale 2
```

| Flag | Default | Description |
|------|---------|-------------|
| `--out` | `D:/Figma Agent/FinalOut` | Output directory |
| `--format` | `png` | `png`, `svg`, `pdf`, or `webp` |
| `--scale` | `2` | Export scale multiplier |

### `autolayout` — Parse, Infer & Convert to Auto Layout

```bash
# Preview conversion plan without modifying files (Dry Run)
node automate.js autolayout "design.figcraft" --dryRun

# Convert and save responsive .figcraft
node automate.js autolayout "design.figcraft" --out "responsive.figcraft"
```

| Flag | Default | Description |
|------|---------|-------------|
| `--out` | *(none)* | Destination path (`.figcraft` or `.json`) |
| `--confidence` | `0.60` | Minimum confidence score threshold (0.0 - 1.0) |
| `--tolerance` | `2` | Geometric variance tolerance in px |
| `--force` | `false` | Force re-conversion of existing auto-layout frames |
| `--dryRun` | `false` | Preview conversion plan without writing |

### `run` — Execute a JSON Workflow

```bash
node automate.js run sample_workflow.json
```

Runs an array of batch commands defined in a JSON file. See [`sample_workflow.json`](sample_workflow.json) for an example.

---

## 🔌 MCP Proxy Server (`figcraft-auto.js`)

An extended MCP proxy that wraps the native FigCraft MCP interface and adds high-level composite tools:

| Composite Tool | What It Does |
|----------------|--------------|
| `scaffold_ui_card` | Build responsive UI cards with auto-layout and typography |
| `generate_color_palette` | Build design-token swatch grids with hex labels |
| `scaffold_navbar` | Build responsive navigation bars with brand and links |
| `batch_export_all_frames` | Export all top-level canvas frames in one call |
| `autolayout_convert_document` | Parse, infer, and convert design containers to Auto Layout |
| `autolayout_manage_presets` | Manage reusable layout styles, locks, and bulk #hook updates |

All standard FigCraft MCP tools are transparently proxied.

---

## 🧩 WASM Plugin: Palette Swatch Grid

A sample **Rust → WebAssembly** plugin demonstrating FigCraft's sandboxed plugin architecture.

```bash
cd plugins/palette-swatch-grid
build.bat
```

Load it in FigCraft: **Plugins → Development → Import plugin from manifest…** → select `figcraft-plugin.json`.

See the full docs in [`plugins/palette-swatch-grid/README.md`](plugins/palette-swatch-grid/README.md).

---

## 🤖 Subagent Roles (Multi-Agent Orchestration)

The `Subagent roles/` directory contains a complete multi-agent framework with **12 specialized roles** for AI-driven design workflows:

| Role | Responsibility |
|------|---------------|
| **Lead Orchestrator** | Coordinates the full pipeline and delegates tasks |
| **UI Architect** | High-level layout, spacing, and visual hierarchy |
| **Design System Engineer** | Variables, tokens, components, and variant libraries |
| **Frontend Engineer** | Design-to-code translation |
| **Mobile UI Specialist** | iOS/Android native patterns and safe areas |
| **Vector Graphics Specialist** | SVG illustrations, icons, and custom paths |
| **Asset Exporter** | Multi-format, multi-scale asset export |
| **Automation Script Specialist** | Scripted batch operations and workflows |
| **Data & Diagram Architect** | Flowcharts, ERDs, and architecture diagrams |
| **Interaction & Motion Engineer** | Prototypes, transitions, and animations |
| **Visual QA Auditor** | Pixel-level review, contrast, alignment checks |
| **Independent Acceptance Judge** | Final pass/fail gate before delivery |

Each role includes detailed instructions, responsibilities, and I/O specifications in its own directory under `Subagent roles/subagents/`.

---

## ⚡ How Dual Mode Works

```
┌─────────────────────────────────────────────────┐
│              automate.js / figcraft-auto.js      │
│                                                  │
│   checkPort(47800) ──► Desktop running?          │
│         │                                        │
│    ┌────┴────┐                                   │
│    ▼         ▼                                   │
│  YES        NO                                   │
│    │         │                                    │
│    ▼         ▼                                   │
│ Attached   Headless                              │
│  Mode       Mode                                 │
│ (live)    (in-process)                           │
└─────────────────────────────────────────────────┘
```

- **Attached Mode**: Connects to the running FigCraft desktop app via TCP on port 47800. Changes appear live on the canvas.
- **Headless Mode**: Spawns an in-process FigCraft engine. No GUI needed — ideal for CI, scripting, and batch jobs.

---

## 📄 License

This project includes dual-licensed subagent components under [Apache 2.0](Subagent%20roles/LICENSE-APACHE) and [MIT](Subagent%20roles/LICENSE-MIT).
