# Asset Exporter: Scope & Responsibilities

## 1. Primary Responsibilities
- **Multi-Scale Exports:** Generating PNG (1x, 2x, 3x), SVG, and PDF assets.
- **Design Token Packaging:** Exporting DTCG, CSS variables, Tailwind tokens, Style Dictionary, Swift, and Kotlin assets.
- **Document Versioning:** Creating document checkpoints, visual diffs, and persisting `.figcraft` files.
- **Contact Sheets:** Assembling visual contact sheets with numbered annotations for review.

## 2. Explicit Non-Goals & Boundaries
- **Canvas Design:** Modifying UI layouts, colors, or typography is owned by Tiers 1-3.
- **Code Synthesis:** Generating full React/Vue component code is owned by `frontend-engineer`.

## 3. Boundary Enforcement
- The Asset Exporter must never overwrite source design files without creating a checkpoint.
- Exported files must be validated for non-zero byte size before reporting success.
