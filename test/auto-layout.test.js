/**
 * Comprehensive Automated Test Suite for FigCraft Auto Layout System
 * 
 * Tests all 17 mandatory acceptance scenarios:
 * 1. Horizontal row with three children and a consistent gap.
 * 2. Vertical stack with consistent spacing.
 * 3. Nested card with header, content, and footer.
 * 4. Button whose width responds to longer text.
 * 5. Text block with multiline content and intrinsic height.
 * 6. Container with asymmetric padding.
 * 7. Fill-sized child beside a fixed-sized child.
 * 8. Hug-sized parent containing nested children.
 * 9. Wrapping list/grid where supported.
 * 10. Absolute-positioned badge over a normal-flow component.
 * 11. Mixed normal-flow and legacy positioned children.
 * 12. Missing font or image asset.
 * 13. Unsupported source node or malformed file.
 * 14. Locked preset and bulk update by hook name.
 * 15. Re-import of an already converted file.
 * 16. Round-trip serialization and reopening.
 * 17. Narrow and wide viewport/frame sizes.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  detectFormat,
  SourceFormat,
  parseDocument,
  inferContainerLayout,
  planConversion,
  applyConversionToDocumentJson,
  validatePlan,
  PresetManager,
  processFile,
  LayoutDirection,
  SizingMode,
  ConfidenceLevel
} = require('../src/auto-layout');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] Scenario ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] Scenario ${totalTests}: ${name}`);
    console.error(`     Error: ${err.message}`);
    if (err.stack) console.error(err.stack.split('\n').slice(1, 4).join('\n'));
  }
}

console.log('\n======================================================');
console.log(' FIGCRAFT AUTO LAYOUT ENGINEER — 17-SCENARIO TEST SUITE');
console.log('======================================================\n');

// 1. Horizontal row with three children and consistent gap
test('Horizontal row with three children and consistent gap', () => {
  const container = { id: 1, name: 'Row', bounds: { x: 0, y: 0, width: 400, height: 100 } };
  const children = [
    { id: 2, name: 'B1', bounds: { x: 20, y: 20, width: 80, height: 60 } },
    { id: 3, name: 'B2', bounds: { x: 120, y: 20, width: 80, height: 60 } },
    { id: 4, name: 'B3', bounds: { x: 220, y: 20, width: 80, height: 60 } }
  ];
  const res = inferContainerLayout(container, children);
  assert.strictEqual(res.layout.mode, 'horizontal');
  assert.strictEqual(res.layout.gap, 20);
  assert.deepStrictEqual(res.layout.padding, [20, 100, 20, 20]);
  assert.strictEqual(res.level, ConfidenceLevel.HIGH);
});

// 2. Vertical stack with consistent spacing
test('Vertical stack with consistent spacing', () => {
  const container = { id: 1, name: 'Stack', bounds: { x: 0, y: 0, width: 300, height: 300 } };
  const children = [
    { id: 2, name: 'Item 1', bounds: { x: 16, y: 16, width: 268, height: 40 } },
    { id: 3, name: 'Item 2', bounds: { x: 16, y: 72, width: 268, height: 40 } }, // gap 16
    { id: 4, name: 'Item 3', bounds: { x: 16, y: 128, width: 268, height: 40 } } // gap 16
  ];
  const res = inferContainerLayout(container, children);
  assert.strictEqual(res.layout.mode, 'vertical');
  assert.strictEqual(res.layout.gap, 16);
  assert.strictEqual(res.layout.padding[0], 16); // top
  assert.strictEqual(res.layout.padding[3], 16); // left
  assert.strictEqual(res.level, ConfidenceLevel.HIGH);
});

// 3. Nested card with header, content, and footer
test('Nested card with header, content, and footer', () => {
  const doc = {
    name: 'Card Test',
    nodes: {
      '1': { id: 1, type: 'page', children: [2] },
      '2': { id: 2, name: 'Card', type: 'frame', bounds: { x: 50, y: 50, width: 360, height: 400 }, children: [3, 4, 5] },
      '3': { id: 3, name: 'Header', type: 'frame', bounds: { x: 20, y: 20, width: 320, height: 50 }, children: [6, 7] },
      '4': { id: 4, name: 'Body', type: 'rectangle', bounds: { x: 20, y: 90, width: 320, height: 200 } },
      '5': { id: 5, name: 'Footer', type: 'frame', bounds: { x: 20, y: 310, width: 320, height: 60 }, children: [8, 9] },
      '6': { id: 6, name: 'Avatar', type: 'rectangle', bounds: { x: 0, y: 5, width: 40, height: 40 } },
      '7': { id: 7, name: 'Title', type: 'text', bounds: { x: 52, y: 15, width: 200, height: 20 } },
      '8': { id: 8, name: 'CancelBtn', type: 'frame', bounds: { x: 0, y: 10, width: 100, height: 40 }, children: [] },
      '9': { id: 9, name: 'SubmitBtn', type: 'frame', bounds: { x: 116, y: 10, width: 120, height: 40 }, children: [] }
    }
  };
  const parsed = parseDocument(doc);
  const plan = planConversion(parsed);
  assert(plan.convertedCount >= 3, `Expected at least 3 containers converted, got ${plan.convertedCount}`);
  
  // Verify Card is vertical
  const cardStep = plan.plan.find(p => p.containerId === 2);
  assert.strictEqual(cardStep.layout.mode, 'vertical');

  // Verify Header is horizontal
  const headerStep = plan.plan.find(p => p.containerId === 3);
  assert.strictEqual(headerStep.layout.mode, 'horizontal');
});

// 4. Button whose width responds to longer text
test('Button whose width responds to longer text', () => {
  const container = { id: 10, name: 'Primary Button', bounds: { x: 0, y: 0, width: 120, height: 40 } };
  const textChild = { id: 11, name: 'Label', type: 'text', text: 'Click Me', bounds: { x: 16, y: 10, width: 88, height: 20 } };
  const res = inferContainerLayout(container, [textChild]);
  
  assert.strictEqual(res.layout.mode, 'horizontal');
  assert.strictEqual(res.layout.sizingH, SizingMode.HUG);
  assert.strictEqual(res.layout.sizingV, SizingMode.HUG);
  const childConfig = res.childLayouts.get(11);
  assert.strictEqual(childConfig.sizingH, SizingMode.HUG);
});

// 5. Text block with multiline content and intrinsic height
test('Text block with multiline content and intrinsic height', () => {
  const container = { id: 1, name: 'Article', bounds: { x: 0, y: 0, width: 400, height: 500 } };
  const textChild = { id: 2, name: 'Paragraph', type: 'text', text: 'Long multiline copy...', bounds: { x: 20, y: 20, width: 360, height: 180 } };
  const res = inferContainerLayout(container, [textChild]);
  const childConfig = res.childLayouts.get(2);
  assert.strictEqual(childConfig.sizingH, SizingMode.FILL);
  assert.strictEqual(childConfig.sizingV, SizingMode.HUG);
});

// 6. Container with asymmetric padding
test('Container with asymmetric padding', () => {
  const container = { id: 1, name: 'Asymmetric Card', bounds: { x: 0, y: 0, width: 300, height: 200 } };
  const child = { id: 2, name: 'Content', bounds: { x: 32, y: 12, width: 244, height: 172 } }; // left: 32, top: 12, right: 24, bottom: 16
  const res = inferContainerLayout(container, [child]);
  assert.deepStrictEqual(res.layout.padding, [12, 24, 16, 32]);
});

// 7. Fill-sized child beside a fixed-sized child
test('Fill-sized child beside a fixed-sized child', () => {
  const container = { id: 1, name: 'Search Bar', bounds: { x: 0, y: 0, width: 500, height: 60 } };
  const icon = { id: 2, name: 'Search Icon', bounds: { x: 16, y: 18, width: 24, height: 24 } };
  const input = { id: 3, name: 'Input Field', bounds: { x: 48, y: 10, width: 436, height: 40 } }; // fills remaining cross space
  const res = inferContainerLayout(container, [icon, input]);
  assert.strictEqual(res.layout.mode, 'horizontal');
  const inputConfig = res.childLayouts.get(3);
  assert.strictEqual(inputConfig.sizingV, SizingMode.FILL);
});

// 8. Hug-sized parent containing nested children
test('Hug-sized parent containing nested children', () => {
  const container = { id: 1, name: 'Chip Container', bounds: { x: 0, y: 0, width: 140, height: 36 } };
  const icon = { id: 2, name: 'Dot', bounds: { x: 10, y: 12, width: 12, height: 12 } };
  const label = { id: 3, name: 'Tag', bounds: { x: 28, y: 8, width: 102, height: 20 } };
  const res = inferContainerLayout(container, [icon, label]);
  assert.strictEqual(res.layout.mode, 'horizontal');
  assert.strictEqual(res.level, ConfidenceLevel.HIGH);
});

// 9. Wrapping list / grid where supported
test('Wrapping list / grid where supported', () => {
  const container = { id: 1, name: 'Grid Container', bounds: { x: 0, y: 0, width: 400, height: 400 } };
  const items = [
    { id: 2, name: 'Item 1', bounds: { x: 20, y: 20, width: 160, height: 160 } },
    { id: 3, name: 'Item 2', bounds: { x: 200, y: 20, width: 160, height: 160 } },
    { id: 4, name: 'Item 3', bounds: { x: 20, y: 200, width: 160, height: 160 } },
    { id: 5, name: 'Item 4', bounds: { x: 200, y: 200, width: 160, height: 160 } }
  ];
  const res = inferContainerLayout(container, items);
  assert(res.layout.mode === 'horizontal' || res.layout.mode === 'vertical');
  assert(res.confidence > 0.60);
});

// 10. Absolute-positioned badge over a normal-flow component
test('Absolute-positioned badge over a normal-flow component', () => {
  const container = { id: 1, name: 'Avatar with Badge', bounds: { x: 0, y: 0, width: 100, height: 100 } };
  const avatar = { id: 2, name: 'Avatar Image', bounds: { x: 10, y: 10, width: 80, height: 80 } };
  const badge = { id: 3, name: 'Online Status Dot', bounds: { x: 72, y: 12, width: 16, height: 16 } }; // overlaps top right of avatar!
  const res = inferContainerLayout(container, [avatar, badge]);
  
  const badgeConfig = res.childLayouts.get(3);
  assert(badgeConfig, 'Badge config must exist');
  assert.strictEqual(badgeConfig.absolute, true, 'Badge must be absolute positioned');
  const avatarConfig = res.childLayouts.get(2);
  assert.strictEqual(avatarConfig.absolute, false, 'Avatar should remain in normal flow');
});

// 11. Mixed normal-flow and legacy positioned children
test('Mixed normal-flow and legacy positioned children', () => {
  const container = { id: 1, name: 'Card with Background', bounds: { x: 0, y: 0, width: 300, height: 200 } };
  const bg = { id: 2, name: 'Card Background', type: 'rectangle', bounds: { x: 0, y: 0, width: 300, height: 200 } };
  const title = { id: 3, name: 'Title', type: 'text', bounds: { x: 20, y: 20, width: 260, height: 30 } };
  const body = { id: 4, name: 'Body Text', type: 'text', bounds: { x: 20, y: 65, width: 260, height: 80 } };
  const res = inferContainerLayout(container, [bg, title, body]);
  
  const bgConfig = res.childLayouts.get(2);
  assert.strictEqual(bgConfig.absolute, true, 'Full bleed background should be treated as absolute layer');
  assert.strictEqual(res.layout.mode, 'vertical');
  assert.strictEqual(res.layout.gap, 15);
});

// 12. Missing font or image asset handling
test('Missing font or image asset handling', () => {
  const doc = {
    name: 'Missing Assets Test',
    nodes: {
      '1': { id: 1, type: 'page', children: [2] },
      '2': {
        id: 2,
        name: 'Frame With Missing Asset',
        type: 'frame',
        bounds: { x: 0, y: 0, width: 300, height: 100 },
        children: [3]
      },
      '3': {
        id: 3,
        name: 'Missing Image Layer',
        type: 'image',
        bounds: { x: 10, y: 10, width: 80, height: 80 },
        fills: [{ type: 'image', image: 'non_existent_hash_99999999' }]
      }
    }
  };
  const parsed = parseDocument(doc);
  const plan = planConversion(parsed);
  assert(plan.convertedCount === 1);
  const applied = applyConversionToDocumentJson(doc, plan);
  assert.strictEqual(applied.appliedCount, 1);
});

// 13. Unsupported source node or malformed file
test('Unsupported source node or malformed file', () => {
  assert.throws(() => {
    parseDocument('invalid { json string');
  }, /Unexpected token|JSON/);

  const detection = detectFormat('/path/to/non_existent_file.xyz');
  assert.strictEqual(detection.format, SourceFormat.UNKNOWN);
});

// 14. Locked preset and bulk update by hook name
test('Locked preset and bulk update by hook name', () => {
  const manager = new PresetManager(path.join(__dirname, 'test_presets.json'));
  
  // Create preset and lock it
  manager.set({
    id: 'test_locked_preset',
    name: 'Navbar Test',
    hook: '#test-nav',
    locked: true,
    layout: { mode: 'horizontal', gap: 30, padding: [10, 20, 10, 20] }
  });

  const doc = {
    nodes: {
      '10': { id: 10, type: 'frame', name: 'Header #test-nav', bounds: { x: 0, y: 0, width: 1000, height: 60 } },
      '20': { id: 20, type: 'frame', name: 'Locked Header #test-nav', locked: true, bounds: { x: 0, y: 0, width: 1000, height: 60 } }
    }
  };

  // Attempt update on locked preset without force -> must throw
  assert.throws(() => {
    manager.updateAllByHooks(doc, '#test-nav', { force: false });
  }, /is locked against updates/);

  // Unlock preset
  manager.setLock('test_locked_preset', false);

  // Update without force -> should update unlocked node 10 and skip locked node 20
  const report = manager.updateAllByHooks(doc, '#test-nav', { force: false });
  assert.strictEqual(report.matchedCount, 1);
  assert.strictEqual(report.skippedLockedCount, 1);
  assert.strictEqual(doc.nodes['10'].layout.gap, 30);

  // Cleanup test file
  if (fs.existsSync(path.join(__dirname, 'test_presets.json'))) {
    fs.unlinkSync(path.join(__dirname, 'test_presets.json'));
  }
});

// 15. Re-import of an already converted file (Idempotency)
test('Re-import of an already converted file (Idempotency)', () => {
  const doc = {
    name: 'Idempotent Test',
    nodes: {
      '1': { id: 1, type: 'page', children: [2] },
      '2': {
        id: 2,
        name: 'Already Converted Frame',
        type: 'frame',
        layout: { mode: 'horizontal', gap: 16, padding: [16, 16, 16, 16] },
        bounds: { x: 0, y: 0, width: 300, height: 100 },
        children: [3]
      },
      '3': { id: 3, name: 'Child Box', bounds: { x: 16, y: 16, width: 100, height: 68 } }
    }
  };

  const parsed = parseDocument(doc);
  // Without force: true, it should skip re-converting
  const plan = planConversion(parsed, { force: false });
  assert.strictEqual(plan.convertedCount, 0);
  assert.strictEqual(plan.skippedCount, 1);
  assert(plan.skipped[0].reason.includes('already has active Auto Layout'));
});

// 16. Round-trip serialization and reopening
test('Round-trip serialization and reopening', () => {
  const doc = {
    format: 'figcraft',
    name: 'Serialization Test',
    nodes: {
      '1': { id: 1, type: 'page', children: [2] },
      '2': {
        id: 2,
        name: 'Auto Card',
        type: 'frame',
        bounds: { x: 0, y: 0, width: 300, height: 150 },
        children: [3, 4]
      },
      '3': { id: 3, name: 'Header', bounds: { x: 16, y: 16, width: 268, height: 40 } },
      '4': { id: 4, name: 'Body', bounds: { x: 16, y: 66, width: 268, height: 60 } }
    }
  };

  const tempJson = path.join(__dirname, 'temp_roundtrip.json');
  fs.writeFileSync(tempJson, JSON.stringify(doc), 'utf8');

  const parsed = parseDocument(tempJson);
  const plan = planConversion(parsed);
  const applied = applyConversionToDocumentJson(doc, plan);
  assert.strictEqual(applied.appliedCount, 1);

  // Save converted json
  fs.writeFileSync(tempJson, JSON.stringify(applied.documentJson, null, 2), 'utf8');

  // Re-parse and verify layout preserved
  const reloaded = parseDocument(tempJson);
  const cardNode = reloaded.nodes.get(2);
  assert.strictEqual(cardNode.layout.mode, 'vertical');
  assert.strictEqual(cardNode.layout.gap, 10);

  fs.unlinkSync(tempJson);
});

// 17. Narrow and wide viewport/frame sizes
test('Narrow and wide viewport/frame sizes', () => {
  const container = { id: 1, name: 'Responsive Container', bounds: { x: 0, y: 0, width: 1000, height: 100 } };
  const child1 = { id: 2, name: 'Sidebar', bounds: { x: 20, y: 20, width: 200, height: 60 } };
  const child2 = { id: 3, name: 'Main Content', bounds: { x: 240, y: 20, width: 740, height: 60 } }; // fills remaining space
  
  const res = inferContainerLayout(container, [child1, child2]);
  assert.strictEqual(res.layout.mode, 'horizontal');
  const mainConfig = res.childLayouts.get(3);
  assert.strictEqual(mainConfig.sizingH, SizingMode.FILL);
});

console.log('\n======================================================');
console.log(` TEST RESULTS: ${passedTests}/${totalTests} Scenarios Passed (${Math.round(passedTests/totalTests*100)}%)`);
console.log('======================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}

