/**
 * Canonical Auto Layout Data Model & Schema Definitions for FigCraft
 * 
 * Provides normalized, validated schemas for flexbox/auto-layout containers,
 * child constraints, and reusable layout style presets (inspired by Figma Auto Layout
 * and PavelLaptev/Figma-Auto-Layout-Styles).
 */

const LayoutDirection = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  GRID: 'grid'
};

const MainAlignment = {
  MIN: 'min',
  CENTER: 'center',
  MAX: 'max',
  SPACE_BETWEEN: 'spaceBetween',
  SPACE_AROUND: 'spaceAround',
  SPACE_EVENLY: 'spaceEvenly'
};

const CrossAlignment = {
  MIN: 'min',
  CENTER: 'center',
  MAX: 'max',
  BASELINE: 'baseline'
};

const SizingMode = {
  FIXED: 'fixed',
  HUG: 'hug',
  FILL: 'fill'
};

const ConfidenceLevel = {
  HIGH: 'HIGH',       // >= 0.85: Safe to convert automatically
  MEDIUM: 'MEDIUM',   // 0.60 - 0.84: Requires explicit approval / review plan
  LOW: 'LOW'          // < 0.60: Preserve static positioning, report ambiguity
};

/**
 * Creates a normalized layout configuration object.
 */
function createLayoutConfig(options = {}) {
  const mode = options.mode || LayoutDirection.HORIZONTAL;
  const gap = typeof options.gap === 'number' ? Math.max(0, options.gap) : 0;
  const crossGap = typeof options.crossGap === 'number' ? Math.max(0, options.crossGap) : gap;
  
  // Padding: [top, right, bottom, left]
  let padding = [0, 0, 0, 0];
  if (Array.isArray(options.padding)) {
    if (options.padding.length === 4) padding = options.padding.map(n => Math.max(0, Number(n) || 0));
    else if (options.padding.length === 2) padding = [options.padding[0], options.padding[1], options.padding[0], options.padding[1]];
    else if (options.padding.length === 1) padding = [options.padding[0], options.padding[0], options.padding[0], options.padding[0]];
  } else if (typeof options.padding === 'number') {
    const p = Math.max(0, options.padding);
    padding = [p, p, p, p];
  }

  return {
    mode,
    gap,
    crossGap,
    padding,
    mainAlign: options.mainAlign || MainAlignment.MIN,
    crossAlign: options.crossAlign || CrossAlignment.MIN,
    contentAlign: options.contentAlign || 'auto',
    wrap: Boolean(options.wrap),
    strokesIncluded: options.strokesIncluded !== false,
    reverseZ: Boolean(options.reverseZ),
    sizingH: options.sizingH || SizingMode.FIXED,
    sizingV: options.sizingV || SizingMode.FIXED,
    minWidth: typeof options.minWidth === 'number' ? options.minWidth : null,
    maxWidth: typeof options.maxWidth === 'number' ? options.maxWidth : null,
    minHeight: typeof options.minHeight === 'number' ? options.minHeight : null,
    maxHeight: typeof options.maxHeight === 'number' ? options.maxHeight : null
  };
}

/**
 * Creates child sizing and layout constraint attributes.
 */
function createChildLayoutConfig(options = {}) {
  return {
    sizingH: options.sizingH || SizingMode.FIXED,
    sizingV: options.sizingV || SizingMode.FIXED,
    absolute: Boolean(options.absolute),
    minWidth: typeof options.minWidth === 'number' ? options.minWidth : null,
    maxWidth: typeof options.maxWidth === 'number' ? options.maxWidth : null,
    minHeight: typeof options.minHeight === 'number' ? options.minHeight : null,
    maxHeight: typeof options.maxHeight === 'number' ? options.maxHeight : null
  };
}

/**
 * Creates a reusable Auto Layout preset definition.
 */
function createPreset(options = {}) {
  if (!options.name) throw new Error('Preset name is required');
  const id = options.id || 'preset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const hook = options.hook || ('#' + options.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

  return {
    id,
    name: options.name,
    hook,
    locked: Boolean(options.locked),
    layout: createLayoutConfig(options.layout || {}),
    childDefaults: createChildLayoutConfig(options.childDefaults || {}),
    description: options.description || '',
    version: options.version || 1,
    createdAt: options.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  LayoutDirection,
  MainAlignment,
  CrossAlignment,
  SizingMode,
  ConfidenceLevel,
  createLayoutConfig,
  createChildLayoutConfig,
  createPreset
};

