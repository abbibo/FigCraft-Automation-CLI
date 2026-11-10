/**
 * Auto Layout Preset & Style Manager (Inspired by PavelLaptev/Figma-Auto-Layout-Styles)
 * 
 * Manages reusable, named Auto Layout presets, semantic #hooks, configuration locking,
 * persistence, and atomic bulk re-application across FigCraft documents.
 */

const fs = require('fs');
const path = require('path');
const { createPreset, createLayoutConfig, createChildLayoutConfig } = require('./canonical-model');

const DEFAULT_PRESETS_FILE = path.join(process.cwd(), 'presets.json');

class PresetManager {
  constructor(filePath = DEFAULT_PRESETS_FILE) {
    this.filePath = filePath;
    this.presets = new Map();
    this.load();
  }

  /**
   * Loads presets from disk or initializes built-in design system presets.
   */
  load() {
    this.presets.clear();
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const item of list) {
            this.presets.set(item.id, item);
          }
          return;
        }
      } catch (e) {
        console.warn(`[PresetManager] Warning loading presets from ${this.filePath}:`, e.message);
      }
    }

    // Initialize industry-standard baseline presets
    this.registerDefaultPresets();
    this.save();
  }

  registerDefaultPresets() {
    const defaultList = [
      createPreset({
        id: 'preset_button_primary',
        name: 'Button / Primary',
        hook: '#btn-primary',
        locked: false,
        description: 'Standard interactive button with horizontal hug sizing and centered alignment',
        layout: createLayoutConfig({
          mode: 'horizontal',
          gap: 8,
          padding: [10, 16, 10, 16],
          mainAlign: 'center',
          crossAlign: 'center',
          sizingH: 'hug',
          sizingV: 'hug'
        }),
        childDefaults: createChildLayoutConfig({ sizingH: 'hug', sizingV: 'hug' })
      }),
      createPreset({
        id: 'preset_card_vertical',
        name: 'Card / Standard Stack',
        hook: '#card-standard',
        locked: false,
        description: 'Vertical card container with header, content, and footer layout',
        layout: createLayoutConfig({
          mode: 'vertical',
          gap: 16,
          padding: [20, 20, 20, 20],
          mainAlign: 'min',
          crossAlign: 'min',
          sizingH: 'fixed',
          sizingV: 'hug'
        }),
        childDefaults: createChildLayoutConfig({ sizingH: 'fill', sizingV: 'hug' })
      }),
      createPreset({
        id: 'preset_navbar_desktop',
        name: 'Navbar / Desktop Header',
        hook: '#nav-header',
        locked: true, // Example locked preset
        description: 'Responsive desktop navigation bar with space-between alignment and brand/links',
        layout: createLayoutConfig({
          mode: 'horizontal',
          gap: 24,
          padding: [14, 32, 14, 32],
          mainAlign: 'spaceBetween',
          crossAlign: 'center',
          sizingH: 'fixed',
          sizingV: 'hug'
        }),
        childDefaults: createChildLayoutConfig({ sizingH: 'hug', sizingV: 'hug' })
      }),
      createPreset({
        id: 'preset_badge_pill',
        name: 'Badge / Pill Tag',
        hook: '#badge-pill',
        locked: false,
        description: 'Compact status pill badge',
        layout: createLayoutConfig({
          mode: 'horizontal',
          gap: 4,
          padding: [4, 8, 4, 8],
          mainAlign: 'center',
          crossAlign: 'center',
          sizingH: 'hug',
          sizingV: 'hug'
        }),
        childDefaults: createChildLayoutConfig({ sizingH: 'hug', sizingV: 'hug' })
      })
    ];

    for (const p of defaultList) {
      this.presets.set(p.id, p);
    }
  }

  /**
   * Saves presets to disk.
   */
  save() {
    try {
      const list = Array.from(this.presets.values());
      fs.writeFileSync(this.filePath, JSON.stringify(list, null, 2), 'utf8');
    } catch (e) {
      console.error(`[PresetManager] Failed to write presets to ${this.filePath}:`, e.message);
    }
  }

  list() {
    return Array.from(this.presets.values());
  }

  get(idOrHook) {
    if (!idOrHook) return null;
    if (this.presets.has(idOrHook)) return this.presets.get(idOrHook);
    for (const preset of this.presets.values()) {
      if (preset.hook === idOrHook || preset.name === idOrHook) {
        return preset;
      }
    }
    return null;
  }

  set(presetData) {
    const existing = this.get(presetData.id);
    if (existing && existing.locked && !presetData.force) {
      throw new Error(`Preset "${existing.name}" is locked. Unlock it first or specify force: true.`);
    }

    const preset = createPreset(presetData);
    this.presets.set(preset.id, preset);
    this.save();
    return preset;
  }

  delete(id, force = false) {
    const existing = this.get(id);
    if (!existing) return false;
    if (existing.locked && !force) {
      throw new Error(`Cannot delete locked preset "${existing.name}". Unlock first or pass force: true.`);
    }
    const res = this.presets.delete(existing.id);
    this.save();
    return res;
  }

  setLock(id, locked = true) {
    const existing = this.get(id);
    if (!existing) throw new Error(`Preset "${id}" not found`);
    existing.locked = Boolean(locked);
    existing.updatedAt = new Date().toISOString();
    this.save();
    return existing;
  }

  /**
   * Updates all frames matching a semantic hook name across a document JSON or session.
   * 
   * @param {Object} docJson - In-memory FigCraft document JSON
   * @param {string} hookName - Semantic hook (e.g. '#card-standard')
   * @param {Object} options - { dryRun, force }
   */
  updateAllByHooks(docJson, hookName, options = {}) {
    const preset = this.get(hookName);
    if (!preset) {
      throw new Error(`No preset found matching hook: "${hookName}"`);
    }

    if (preset.locked && !options.force) {
      throw new Error(`Preset "${preset.name}" is locked against updates.`);
    }

    const matchedNodes = [];
    const skippedLocked = [];
    const rawNodes = docJson.nodes || {};

    for (const [id, node] of Object.entries(rawNodes)) {
      if (node.type !== 'frame') continue;

      const nodeName = node.name || '';
      const nodeHook = (node.plugin_data && node.plugin_data['autolayout_hook']) || null;

      const isMatch = nodeHook === preset.hook || nodeName.includes(preset.hook) || nodeName === preset.name;
      if (isMatch) {
        // Check if individual node is locked
        const isNodeLocked = Boolean(node.locked || (node.plugin_data && node.plugin_data['autolayout_locked'] === 'true'));
        if (isNodeLocked && !options.force) {
          skippedLocked.push({ id, name: nodeName, reason: 'Node is locked' });
          continue;
        }
        matchedNodes.push({ id, name: nodeName, currentLayout: node.layout });
      }
    }

    const report = {
      preset: preset.name,
      hook: preset.hook,
      matchedCount: matchedNodes.length,
      matchedNodes: matchedNodes.map(m => ({ id: m.id, name: m.name })),
      skippedLockedCount: skippedLocked.length,
      skippedLocked,
      dryRun: Boolean(options.dryRun)
    };

    if (options.dryRun) {
      return report;
    }

    // Apply layout update to all matched nodes
    for (const matched of matchedNodes) {
      const node = rawNodes[matched.id];
      node.layout = {
        mode: preset.layout.mode,
        gap: preset.layout.gap,
        cross_gap: preset.layout.crossGap,
        padding: preset.layout.padding,
        main_align: preset.layout.mainAlign,
        cross_align: preset.layout.crossAlign,
        content_align: preset.layout.contentAlign,
        wrap: preset.layout.wrap,
        strokes_included: preset.layout.strokesIncluded,
        reverse_z: preset.layout.reverseZ,
        grid_columns: 2,
        grid_rows: 2,
        column_tracks: [],
        row_tracks: []
      };

      node.child_layout = node.child_layout || {};
      node.child_layout.sizing_h = preset.layout.sizingH;
      node.child_layout.sizing_v = preset.layout.sizingV;

      node.plugin_data = node.plugin_data || {};
      node.plugin_data['autolayout_hook'] = preset.hook;
      node.plugin_data['autolayout_preset'] = preset.id;
    }

    return report;
  }
}

module.exports = {
  PresetManager,
  DEFAULT_PRESETS_FILE
};

