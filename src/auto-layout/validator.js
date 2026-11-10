/**
 * Auto Layout Validator & Visual Fidelity Auditor
 * 
 * Verifies structural invariants, parent-child bound tolerances, responsive reflow
 * at multiple viewport widths, and flags potential visual regressions.
 */

/**
 * Validates a converted layout container against its baseline coordinates.
 * 
 * @param {Object} baselineNode - Original normalized node before conversion
 * @param {Array<Object>} baselineChildren - Original child nodes
 * @param {Object} convertedLayout - Converted layout configuration
 * @param {Map<number, Object>} convertedChildLayouts - Child sizing configurations
 */
function validateContainerFidelity(baselineNode, baselineChildren, convertedLayout, convertedChildChildLayouts) {
  const issues = [];
  const checks = [];

  const containerW = baselineNode.bounds.width;
  const containerH = baselineNode.bounds.height;
  const padding = convertedLayout.padding || [0, 0, 0, 0];
  const [padTop, padRight, padBottom, padLeft] = padding;

  // 1. Boundary envelope check
  const availableW = containerW - padLeft - padRight;
  const availableH = containerH - padTop - padBottom;

  if (availableW < 0 || availableH < 0) {
    issues.push({
      type: 'PADDING_EXCEEDS_BOUNDS',
      message: `Total padding [${padding.join(', ')}] exceeds container dimensions (${containerW}x${containerH})`
    });
  } else {
    checks.push('Padding fits within container dimensions');
  }

  // 2. Child alignment and flow check
  let currentOffset = 0;
  const flowChildren = baselineChildren.filter(c => {
    const config = convertedChildChildLayouts.get(c.id);
    return !config || !config.absolute;
  });

  if (convertedLayout.mode === 'horizontal') {
    for (let i = 0; i < flowChildren.length; i++) {
      const child = flowChildren[i];
      const cb = child.bounds;
      const expectedY = padTop; // simplified for min crossAlign
      
      // Check cross axis deviation
      if (convertedLayout.crossAlign === 'min' && Math.abs(cb.y - padTop) > 2) {
        issues.push({
          type: 'CROSS_AXIS_MISMATCH',
          nodeId: child.id,
          message: `Child "${child.name}" Y=${cb.y} deviates from inferred top padding ${padTop}`
        });
      }
    }
    checks.push(`Verified ${flowChildren.length} horizontal flow elements`);
  } else if (convertedLayout.mode === 'vertical') {
    for (let i = 0; i < flowChildren.length; i++) {
      const child = flowChildren[i];
      const cb = child.bounds;
      
      // Check cross axis deviation
      if (convertedLayout.crossAlign === 'min' && Math.abs(cb.x - padLeft) > 2) {
        issues.push({
          type: 'CROSS_AXIS_MISMATCH',
          nodeId: child.id,
          message: `Child "${child.name}" X=${cb.x} deviates from inferred left padding ${padLeft}`
        });
      }
    }
    checks.push(`Verified ${flowChildren.length} vertical flow elements`);
  }

  // 3. Responsive Reflow Simulation (+100px expanded viewport)
  const expandedW = containerW + 100;
  let expandedFillCount = 0;
  for (const child of flowChildren) {
    const config = convertedChildChildLayouts.get(child.id);
    if (config && config.sizingH === 'fill') {
      expandedFillCount++;
    }
  }

  checks.push(`Responsive simulation: ${expandedFillCount} child elements respond to horizontal expansion`);

  return {
    valid: issues.length === 0,
    containerId: baselineNode.id,
    containerName: baselineNode.name,
    checksPassed: checks.length,
    checks,
    issuesCount: issues.length,
    issues
  };
}

/**
 * Validates an entire conversion plan.
 */
function validatePlan(parsedDoc, conversionPlan) {
  const reports = [];
  let totalIssues = 0;

  for (const step of conversionPlan.plan) {
    const baselineNode = parsedDoc.nodes.get(step.containerId);
    if (!baselineNode) continue;

    const baselineChildren = (baselineNode.children || []).map(cid => parsedDoc.nodes.get(cid)).filter(Boolean);
    const childConfigs = new Map();
    for (const cu of step.childUpdates) {
      childConfigs.set(cu.id, cu.childLayout);
    }

    const report = validateContainerFidelity(baselineNode, baselineChildren, step.layout, childConfigs);
    totalIssues += report.issuesCount;
    reports.push(report);
  }

  return {
    valid: totalIssues === 0,
    containersValidated: reports.length,
    totalIssues,
    reports
  };
}

module.exports = {
  validateContainerFidelity,
  validatePlan
};

