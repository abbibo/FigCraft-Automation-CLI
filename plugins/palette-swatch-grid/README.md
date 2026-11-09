# FigCraft Plugin: Palette Swatch Grid

A modular WebAssembly plugin for **FigCraft** that generates design token color swatches with auto-layout on the canvas.

## Anatomy of a FigCraft Plugin

FigCraft runs plugins using a sandboxed WebAssembly interpreter (`wasmi`).
Unlike Figma plugins (which run JavaScript in an iframe), FigCraft plugins:
1. **Target WebAssembly (`wasm32-unknown-unknown`)**: Written in Rust, C, or AssemblyScript without OS/WASI overhead.
2. **Execute via FigCraft Commands**: The plugin interacts with the canvas by dispatching FigCraft internal commands (`node.create`, `shape.*`, `layout.*`, etc.).
3. **Pure Sandbox & Undo Safe**: All actions run within instruction fuel limits and commit as a single undo step.

## File Structure

```
palette-swatch-grid/
├── figcraft-plugin.json      # Manifest declaring id, permissions, and entrypoint
├── palette_swatch_grid.wasm  # Compiled WebAssembly binary
├── Cargo.toml                # Rust package configuration (cdylib, no_std)
├── src/
│   └── lib.rs                # Rust plugin source code
├── build.bat                 # Build script for wasm32-unknown-unknown
└── README.md                 # Documentation
```

## Manifest (`figcraft-plugin.json`)

```json
{
  "id": "org.antigravity.palette-swatch-grid",
  "name": "Palette Swatch Grid",
  "version": "1.0.0",
  "description": "Generates a grid of color swatches and design tokens from a palette of hex colors.",
  "main": "palette_swatch_grid.wasm",
  "permissions": {
    "access": "write",
    "commands": [
      "node.*",
      "shape.*",
      "text.*",
      "layout.*"
    ]
  }
}
```

## How to Load in FigCraft Desktop

1. Open FigCraft desktop application.
2. Go to the top menu: **Plugins ▸ Development ▸ Import plugin from manifest…**
3. Select this folder's `figcraft-plugin.json`.
4. Run the plugin from the **Plugins** menu anytime!
