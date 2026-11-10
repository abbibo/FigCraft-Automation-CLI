/**
 * Geometric and Semantic Auto Layout Inference Engine
 * 
 * Inspects static coordinate geometry, sibling relationships, and visual hierarchies
 * to infer production-grade responsive Auto Layout configurations (horizontal, vertical,
 * grid/wrap, padding, gap, alignment, and child fill/hug constraints) with deterministic confidence scoring.
 */

const {
  LayoutDirection,
  MainAlignment,
  CrossAlignment,
  SizingMode,
  ConfidenceLevel,
  createLayoutConfig,
  createChildLayoutConfig
} = require('./canonical-model');

/**
 * Computes mean and standard deviation of an array of numbers.
 */
function getStats(arr) {
  if (!arr || arr.length === 0) return { mean: 0, stdDev: 0, min: 0, max: 0, median: 0 };
  const sum = arr.reduce((a, b) => a + b, 0);
  const mean = sum / arr.length;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  const sorted = [...arr].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return {
    mean,
    stdDev: Math.sqrt(variance),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median
  };
}

/**
 * Checks if two bounding boxes overlap significantly.
 */
function checkOverlap(b1, b2, tolerance = 2) {
  const xOverlap = Math.max(0, Math.min(b1.x + b1.width, b2.x + b2.width) - Math.max(b1.x, b2.x));
  const yOverlap = Math.max(0, Math.min(b1.y + b1.height, b2.y + b2.height) - Math.max(b1.y, b2.y));
  const areaOverlap = xOverlap * yOverlap;
  const minArea = Math.min(b1.width * b1.height, b2.width * b2.height);
  if (minArea <= 0) return false;
  return (areaOverlap / minArea) > 0.25; // >25% overlap
}

/**
 * Analyzes a container node and its children to infer auto layout.
 * 
 * @param {Object} container - Normalized container node
 * @param {Array<Object>} children - Normalized children nodes
 * @param {Object} options - Inference configuration options
 */
function inferContainerLayout(container, children = [], options = {}) {
  const tolerance = typeof options.tolerance === 'number' ? options.tolerance : 2;
  const cb = container.bounds || { x: 0, y: 0, width: 0, height: 0 };
  const containerWidth = cb.width || 0;
  const containerHeight = cb.height || 0;

  // Filter visible children with non-zero bounds
  const validChildren = children.filter(c => c.visible !== false && c.bounds && (c.bounds.width > 0 || c.bounds.height > 0));

  // If container has 0 child
  if (validChildren.length === 0) {
    return {
      confidence: 1.0,
      level: ConfidenceLevel.HIGH,
      reasons: ['Empty container: default horizontal auto layout applied'],
      layout: createLayoutConfig({ mode: LayoutDirection.HORIZONTAL, padding: 0, gap: 0 }),
      childLayouts: new Map()
    };
  }

  // 1. Separate full-bleed background layers and floating/absolute badges
  let flowChildren = [...validChildren];
  const absoluteChildIds = new Set();
  const childLayouts = new Map();

  // Background check: bottom-most layer that matches container dimensions closely (>= 96%)
  if (flowChildren.length > 1) {
    const bottomChild = flowChildren[0];
    const b = bottomChild.bounds;
    const isFullBleed = Math.abs(b.x) <= tolerance &&
                        Math.abs(b.y) <= tolerance &&
                        Math.abs(b.width - containerWidth) <= tolerance &&
                        Math.abs(b.height - containerHeight) <= tolerance;
    if (isFullBleed && bottomChild.type === 'rectangle') {
      absoluteChildIds.add(bottomChild.id);
      flowChildren.shift(); // remove from normal flow
      childLayouts.set(bottomChild.id, createChildLayoutConfig({ absolute: true }));
    }
  }

  // Floating/overlay badge check: element that significantly overlaps another normal-flow element
  for (let i = flowChildren.length - 1; i >= 0; i--) {
    const candidate = flowChildren[i];
    const cBounds = candidate.bounds;
    for (let j = 0; j < i; j++) {
      const target = flowChildren[j];
      if (checkOverlap(cBounds, target.bounds, tolerance)) {
        absoluteChildIds.add(candidate.id);
        childLayouts.set(candidate.id, createChildLayoutConfig({ absolute: true }));
        flowChildren.splice(i, 1);
        break;
      }
    }
  }

  // If after extracting overlays only 1 flow child remains
  if (flowChildren.length === 1) {
    const child = flowChildren[0];
    const b = child.bounds;
    const padLeft = Math.max(0, Math.round(b.x));
    const padTop = Math.max(0, Math.round(b.y));
    const padRight = Math.max(0, Math.round(containerWidth - (b.x + b.width)));
    const padBottom = Math.max(0, Math.round(containerHeight - (b.y + b.height)));

    const padding = [padTop, padRight, padBottom, padLeft];
    const isCenteredH = Math.abs(padLeft - padRight) <= tolerance;
    const isCenteredV = Math.abs(padTop - padBottom) <= tolerance;

    const isButtonLike = (container.name.toLowerCase().includes('btn') ||
                          container.name.toLowerCase().includes('button') ||
                          container.name.toLowerCase().includes('badge') ||
                          container.name.toLowerCase().includes('tag'));

    const childSizingH = (b.width >= containerWidth - padLeft - padRight - tolerance) ? SizingMode.FILL : SizingMode.HUG;
    const childSizingV = SizingMode.HUG;

    childLayouts.set(child.id, createChildLayoutConfig({
      sizingH: isButtonLike ? SizingMode.HUG : childSizingH,
      sizingV: childSizingV,
      absolute: false
    }));

    return {
      confidence: 0.95,
      level: ConfidenceLevel.HIGH,
      reasons: ['Single child container: mapped padding and intrinsic sizing'],
      layout: createLayoutConfig({
        mode: LayoutDirection.HORIZONTAL,
        gap: 0,
        padding,
        mainAlign: isCenteredH ? MainAlignment.CENTER : MainAlignment.MIN,
        crossAlign: isCenteredV ? CrossAlignment.CENTER : CrossAlignment.MIN,
        sizingH: isButtonLike ? SizingMode.HUG : SizingMode.FIXED,
        sizingV: isButtonLike ? SizingMode.HUG : SizingMode.FIXED
      }),
      childLayouts
    };
  }

  // 2. Check for Multi-row Grid / Wrap layout (e.g. 2x2, 3x3 swatches or cards)
  const sortedByY = [...flowChildren].sort((a, b) => a.bounds.y - b.bounds.y);
  const rows = [];
  let currentRow = [sortedByY[0]];

  for (let i = 1; i < sortedByY.length; i++) {
    const curr = sortedByY[i];
    const prev = sortedByY[i - 1];
    // Check if on same horizontal row
    if (Math.abs(curr.bounds.y - prev.bounds.y) <= tolerance * 2) {
      currentRow.push(curr);
    } else {
      rows.push(currentRow);
      currentRow = [curr];
    }
  }
  rows.push(currentRow);

  const isGridLike = rows.length > 1 && rows.every(r => r.length > 1);

  if (isGridLike) {
    // Sort each row by X
    rows.forEach(r => r.sort((a, b) => a.bounds.x - b.bounds.x));
    const rowGaps = [];
    const colGaps = [];

    for (const r of rows) {
      for (let i = 0; i < r.length - 1; i++) {
        colGaps.push(r[i + 1].bounds.x - (r[i].bounds.x + r[i].bounds.width));
      }
    }
    for (let i = 0; i < rows.length - 1; i++) {
      const row1Bottom = Math.max(...rows[i].map(c => c.bounds.y + c.bounds.height));
      const row2Top = Math.min(...rows[i + 1].map(c => c.bounds.y));
      rowGaps.push(row2Top - row1Bottom);
    }

    const gap = Math.max(0, Math.round(getStats(colGaps).median));
    const crossGap = Math.max(0, Math.round(getStats(rowGaps).median));

    const minX = Math.min(...flowChildren.map(c => c.bounds.x));
    const minY = Math.min(...flowChildren.map(c => c.bounds.y));
    const maxR = Math.max(...flowChildren.map(c => c.bounds.x + c.bounds.width));
    const maxB = Math.max(...flowChildren.map(c => c.bounds.y + c.bounds.height));

    const padding = [
      Math.max(0, Math.round(minY)),
      Math.max(0, Math.round(containerWidth - maxR)),
      Math.max(0, Math.round(containerHeight - maxB)),
      Math.max(0, Math.round(minX))
    ];

    for (const child of flowChildren) {
      childLayouts.set(child.id, createChildLayoutConfig({
        sizingH: SizingMode.FIXED,
        sizingV: SizingMode.FIXED,
        absolute: false
      }));
    }

    return {
      confidence: 0.92,
      level: ConfidenceLevel.HIGH,
      reasons: ['Multi-row grid / wrapping layout pattern detected'],
      layout: createLayoutConfig({
        mode: LayoutDirection.HORIZONTAL,
        wrap: true,
        gap,
        crossGap,
        padding,
        mainAlign: MainAlignment.MIN,
        crossAlign: CrossAlignment.MIN,
        sizingH: SizingMode.FIXED,
        sizingV: SizingMode.HUG
      }),
      childLayouts
    };
  }

  // 3. Multi-child linear direction inference (Horizontal vs Vertical)
  const sortedByX = [...flowChildren].sort((a, b) => a.bounds.x - b.bounds.x);

  const hGaps = [];
  let hMonotonic = true;
  for (let i = 0; i < sortedByX.length - 1; i++) {
    const curr = sortedByX[i].bounds;
    const next = sortedByX[i + 1].bounds;
    const g = next.x - (curr.x + curr.width);
    hGaps.push(g);
    if (next.x < curr.x + curr.width - tolerance) {
      hMonotonic = false; // overlap on X
    }
  }
  const hYCenters = sortedByX.map(c => c.bounds.y + c.bounds.height / 2);
  const hYStats = getStats(hYCenters);
  const hGapStats = getStats(hGaps);

  const vGaps = [];
  let vMonotonic = true;
  for (let i = 0; i < sortedByY.length - 1; i++) {
    const curr = sortedByY[i].bounds;
    const next = sortedByY[i + 1].bounds;
    const g = next.y - (curr.y + curr.height);
    vGaps.push(g);
    if (next.y < curr.y + curr.height - tolerance) {
      vMonotonic = false; // overlap on Y
    }
  }
  const vXCenters = sortedByY.map(c => c.bounds.x + c.bounds.width / 2);
  const vXStats = getStats(vXCenters);
  const vGapStats = getStats(vGaps);

  let chosenDirection = LayoutDirection.VERTICAL;
  let chosenGaps = vGaps;
  let chosenGapStats = vGapStats;
  let activeOrderedChildren = sortedByY;
  let directionConfidence = 0.5;
  const reasons = [];

  if (hMonotonic && !vMonotonic) {
    chosenDirection = LayoutDirection.HORIZONTAL;
    chosenGaps = hGaps;
    chosenGapStats = hGapStats;
    activeOrderedChildren = sortedByX;
    directionConfidence = 0.90;
    reasons.push('Horizontal progression without vertical overlap detected');
  } else if (vMonotonic && !hMonotonic) {
    chosenDirection = LayoutDirection.VERTICAL;
    chosenGaps = vGaps;
    chosenGapStats = vGapStats;
    activeOrderedChildren = sortedByY;
    directionConfidence = 0.90;
    reasons.push('Vertical progression without horizontal overlap detected');
  } else {
    // Both or neither are monotonic: compare center alignment variances
    if (hYStats.stdDev < vXStats.stdDev) {
      chosenDirection = LayoutDirection.HORIZONTAL;
      chosenGaps = hGaps;
      chosenGapStats = hGapStats;
      activeOrderedChildren = sortedByX;
      directionConfidence = 0.75;
      reasons.push(`Horizontal direction selected based on lower cross-axis variance`);
    } else {
      chosenDirection = LayoutDirection.VERTICAL;
      chosenGaps = vGaps;
      chosenGapStats = vGapStats;
      activeOrderedChildren = sortedByY;
      directionConfidence = 0.75;
      reasons.push(`Vertical direction selected based on lower cross-axis variance`);
    }
  }

  // Gap & Space-between calculation
  let gap = Math.max(0, Math.round(chosenGapStats.median));
  let mainAlign = MainAlignment.MIN;

  if (chosenGaps.length > 0 && chosenGapStats.stdDev > tolerance * 2) {
    const firstB = activeOrderedChildren[0].bounds;
    const lastB = activeOrderedChildren[activeOrderedChildren.length - 1].bounds;
    if (chosenDirection === LayoutDirection.HORIZONTAL) {
      const nearLeft = firstB.x <= 24;
      const nearRight = (containerWidth - (lastB.x + lastB.width)) <= 24;
      if (nearLeft && nearRight && activeOrderedChildren.length === 2) {
        mainAlign = MainAlignment.SPACE_BETWEEN;
        gap = 0;
        reasons.push('Opposing edge alignment detected: spaceBetween main axis');
      }
    } else {
      const nearTop = firstB.y <= 24;
      const nearBottom = (containerHeight - (lastB.y + lastB.height)) <= 24;
      if (nearTop && nearBottom && activeOrderedChildren.length === 2) {
        mainAlign = MainAlignment.SPACE_BETWEEN;
        gap = 0;
        reasons.push('Opposing edge alignment detected: spaceBetween main axis');
      }
    }
  }

  // Padding calculation
  const allX = flowChildren.map(c => c.bounds.x);
  const allY = flowChildren.map(c => c.bounds.y);
  const allRights = flowChildren.map(c => c.bounds.x + c.bounds.width);
  const allBottoms = flowChildren.map(c => c.bounds.y + c.bounds.height);

  const minX = Math.min(...allX);
  const minY = Math.min(...allY);
  const maxRight = Math.max(...allRights);
  const maxBottom = Math.max(...allBottoms);

  const padTop = Math.max(0, Math.round(minY));
  const padBottom = Math.max(0, Math.round(containerHeight - maxBottom));
  const padLeft = Math.max(0, Math.round(minX));
  const padRight = Math.max(0, Math.round(containerWidth - maxRight));
  const padding = [padTop, padRight, padBottom, padLeft];

  // Cross-axis alignment calculation
  let crossAlign = CrossAlignment.MIN;
  if (chosenDirection === LayoutDirection.HORIZONTAL) {
    const topTops = flowChildren.map(c => c.bounds.y);
    const topCenters = flowChildren.map(c => c.bounds.y + c.bounds.height / 2);
    const topBottoms = flowChildren.map(c => c.bounds.y + c.bounds.height);

    const stdTops = getStats(topTops).stdDev;
    const stdCenters = getStats(topCenters).stdDev;
    const stdBottoms = getStats(topBottoms).stdDev;

    if (stdCenters <= stdTops && stdCenters <= stdBottoms && stdCenters <= tolerance) {
      crossAlign = CrossAlignment.CENTER;
    } else if (stdBottoms < stdTops && stdBottoms <= tolerance) {
      crossAlign = CrossAlignment.MAX;
    } else {
      crossAlign = CrossAlignment.MIN;
    }
  } else {
    const leftLefts = flowChildren.map(c => c.bounds.x);
    const leftCenters = flowChildren.map(c => c.bounds.x + c.bounds.width / 2);
    const leftRights = flowChildren.map(c => c.bounds.x + c.bounds.width);

    const stdLefts = getStats(leftLefts).stdDev;
    const stdCenters = getStats(leftCenters).stdDev;
    const stdRights = getStats(leftRights).stdDev;

    if (stdCenters <= stdLefts && stdCenters <= stdRights && stdCenters <= tolerance) {
      crossAlign = CrossAlignment.CENTER;
    } else if (stdRights < stdLefts && stdRights <= tolerance) {
      crossAlign = CrossAlignment.MAX;
    } else {
      crossAlign = CrossAlignment.MIN;
    }
  }

  // Child sizing assignment (Fixed, Hug, Fill)
  const availableW = containerWidth - padLeft - padRight;
  const availableH = containerHeight - padTop - padBottom;

  for (const child of flowChildren) {
    const cbChild = child.bounds;
    let sizingH = SizingMode.FIXED;
    let sizingV = SizingMode.FIXED;

    if (chosenDirection === LayoutDirection.VERTICAL) {
      // Cross-axis is horizontal (width)
      if (Math.abs(cbChild.width - availableW) <= tolerance * 2 || cbChild.width >= availableW * 0.92) {
        sizingH = SizingMode.FILL;
      } else {
        sizingH = (child.type === 'text') ? SizingMode.HUG : SizingMode.FIXED;
      }
      sizingV = SizingMode.HUG;
    } else {
      // Cross-axis is vertical (height)
      if (Math.abs(cbChild.height - availableH) <= tolerance * 2 || cbChild.height >= availableH * 0.92) {
        sizingV = SizingMode.FILL;
      } else {
        sizingV = SizingMode.HUG;
      }

      // Main-axis is horizontal (width):
      // Check if this child absorbs the remaining main-axis space (fill)
      const otherChildrenW = flowChildren
        .filter(c => c.id !== child.id)
        .reduce((sum, c) => sum + c.bounds.width, 0);
      const expectedFillW = availableW - otherChildrenW - (flowChildren.length - 1) * gap;

      if (expectedFillW > 0 && Math.abs(cbChild.width - expectedFillW) <= tolerance * 3 && cbChild.width > 120) {
        sizingH = SizingMode.FILL;
      } else {
        sizingH = (child.type === 'text') ? SizingMode.HUG : SizingMode.FIXED;
      }
    }

    childLayouts.set(child.id, createChildLayoutConfig({
      sizingH,
      sizingV,
      absolute: false
    }));
  }

  const gapPenalty = Math.min(0.20, (chosenGapStats.stdDev / 10) * 0.1);
  let overallConfidence = directionConfidence - gapPenalty;
  if (chosenGapStats.stdDev <= tolerance) overallConfidence += 0.08;
  overallConfidence = Math.max(0.1, Math.min(0.98, overallConfidence));

  let level = ConfidenceLevel.HIGH;
  if (overallConfidence < 0.60) level = ConfidenceLevel.LOW;
  else if (overallConfidence < 0.85) level = ConfidenceLevel.MEDIUM;

  const layout = createLayoutConfig({
    mode: chosenDirection,
    gap,
    padding,
    mainAlign,
    crossAlign,
    sizingH: SizingMode.FIXED,
    sizingV: SizingMode.HUG
  });

  return {
    confidence: Number(overallConfidence.toFixed(2)),
    level,
    reasons,
    layout,
    childLayouts
  };
}

module.exports = {
  inferContainerLayout,
  getStats,
  checkOverlap
};
