/**
 * Auto Layout Conversion Engine
 * 
 * Generates and applies deterministic Auto Layout conversion plans to FigCraft documents,
 * supporting dryRun previews, idempotency, atomic batches, and visual fidelity preservation.
 */

const { inferContainerLayout } = require('./inferencer');
const { ConfidenceLevel } = require('./canonical-model');

/**
 * Builds an Auto Layout conversion plan for a parsed document or subtree.
 * 
 * @param {Object} parsedDoc - Normalized document from parser.js
 * @param {Object} options - { minConfidence: 0.60, targetNodeIds: [], force: false }
 */
function planConversion(parsedDoc, options = {}) {
  const minConfidence = typeof options.minConfidence === 'number' ? options.minConfidence : 0.60;
  const targetIds = Array.isArray(options.targetNodeIds) && options.targetNodeIds.length > 0 ? new Set(options.targetNodeIds.map(Number)) : null;
  const force = Boolean(options.force);

  const plan = [];
  const warnings = [];
  const skipped = [];

  const nodes = parsedDoc.nodes; // Map of id -> normalized node

  for (const [id, node] of nodes.entries()) {
    // Only frames and groups with children are layout candidates
    if (node.type !== 'frame' && node.type !== 'group') continue;
    if (targetIds && !targetIds.has(Number(id))) continue;

    // Idempotency: check if frame already has valid auto layout
    const hasExistingLayout = node.layout && (node.layout.mode === 'horizontal' || node.layout.mode === 'vertical' || node.layout.mode === 'grid');
    if (hasExistingLayout && !force) {
      skipped.push({
        id,
        name: node.name,
        reason: 'Frame already has active Auto Layout (use force: true to re-infer)'
      });
      continue;
    }

    // Collect child nodes
    const children = (node.children || []).map(cid => nodes.get(cid)).filter(Boolean);
    if (children.length === 0) {
      continue;
    }

    // Run inference
    const inference = inferContainerLayout(node, children, options);

    if (inference.confidence < minConfidence) {
      warnings.push({
        id,
        name: node.name,
        confidence: inference.confidence,
        reason: `Low confidence (${inference.confidence}): preserving absolute coordinates to avoid visual distortion`,
        reasons: inference.reasons
      });
      skipped.push({
        id,
        name: node.name,
        reason: `Confidence ${inference.confidence} below threshold ${minConfidence}`
      });
      continue;
    }

    // Build planned modifications
    const childUpdates = [];
    for (const [childId, childConfig] of inference.childLayouts.entries()) {
      const childNode = nodes.get(childId);
      childUpdates.push({
        id: childId,
        name: childNode ? childNode.name : `Node ${childId}`,
        childLayout: childConfig
      });
    }

    plan.push({
      containerId: id,
      containerName: node.name,
      confidence: inference.confidence,
      confidenceLevel: inference.level,
      reasons: inference.reasons,
      layout: inference.layout,
      childUpdates
    });
  }

  return {
    documentName: parsedDoc.name,
    totalCandidates: plan.length + skipped.length,
    convertedCount: plan.length,
    skippedCount: skipped.length,
    plan,
    warnings,
    skipped
  };
}

/**
 * Applies a conversion plan directly to a FigCraft document JSON structure in-memory.
 */
function applyConversionToDocumentJson(docJson, conversionPlan) {
  const rawNodes = docJson.nodes || {};
  let appliedCount = 0;

  for (const step of conversionPlan.plan) {
    const rawContainer = rawNodes[step.containerId];
    if (!rawContainer) continue;

    // Update container layout
    rawContainer.layout = {
      mode: step.layout.mode,
      gap: step.layout.gap,
      cross_gap: step.layout.crossGap,
      padding: step.layout.padding,
      main_align: step.layout.mainAlign,
      cross_align: step.layout.crossAlign,
      content_align: step.layout.contentAlign,
      wrap: step.layout.wrap,
      strokes_included: step.layout.strokesIncluded,
      reverse_z: step.layout.reverseZ,
      grid_columns: 2,
      grid_rows: 2,
      column_tracks: [],
      row_tracks: []
    };

    rawContainer.child_layout = rawContainer.child_layout || {};
    rawContainer.child_layout.sizing_h = step.layout.sizingH;
    rawContainer.child_layout.sizing_v = step.layout.sizingV;

    // Update child layout properties
    for (const childStep of step.childUpdates) {
      const rawChild = rawNodes[childStep.id];
      if (!rawChild) continue;

      rawChild.child_layout = rawChild.child_layout || {};
      rawChild.child_layout.sizing_h = childStep.childLayout.sizingH;
      rawChild.child_layout.sizing_v = childStep.childLayout.sizingV;
      rawChild.child_layout.absolute = Boolean(childStep.childLayout.absolute);
    }

    appliedCount++;
  }

  return {
    appliedCount,
    documentJson: docJson
  };
}

/**
 * Generates FigCraft MCP/CLI command batch script for execution in active session.
 */
function generateCommandBatch(conversionPlan) {
  const commands = [];

  for (const step of conversionPlan.plan) {
    // 1. Container node.set
    commands.push({
      command: 'node.set',
      params: {
        ids: [step.containerId],
        layout: {
          mode: step.layout.mode,
          gap: step.layout.gap,
          crossGap: step.layout.crossGap,
          padding: step.layout.padding,
          mainAlign: step.layout.mainAlign,
          crossAlign: step.layout.crossAlign,
          wrap: step.layout.wrap
        },
        sizingH: step.layout.sizingH,
        sizingV: step.layout.sizingV
      }
    });

    // 2. Child node.set
    for (const childStep of step.childUpdates) {
      commands.push({
        command: 'node.set',
        params: {
          ids: [childStep.id],
          sizingH: childStep.childLayout.sizingH,
          sizingV: childStep.childLayout.sizingV,
          absolute: childStep.childLayout.absolute
        }
      });
    }
  }

  return commands;
}

module.exports = {
  planConversion,
  applyConversionToDocumentJson,
  generateCommandBatch
};

