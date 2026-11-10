/**
 * FigCraft Auto Layout System — Unified Entry Point
 * 
 * Production-quality Auto Layout parsing, inference, conversion, preset management,
 * and visual validation pipeline for FigCraft and Craft-originated design assets.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  LayoutDirection,
  MainAlignment,
  CrossAlignment,
  SizingMode,
  ConfidenceLevel,
  createLayoutConfig,
  createChildLayoutConfig,
  createPreset
} = require('./canonical-model');
const { detectFormat, SourceFormat } = require('./detector');
const { parseDocument, normalizeDocumentJson } = require('./parser');
const { inferContainerLayout, getStats, checkOverlap } = require('./inferencer');
const { planConversion, applyConversionToDocumentJson, generateCommandBatch } = require('./converter');
const { PresetManager, DEFAULT_PRESETS_FILE } = require('./preset-manager');
const { validateContainerFidelity, validatePlan } = require('./validator');

/**
 * Executes full end-to-end processing of a design document.
 * 
 * @param {string} inputPath - Path to input design file (.figcraft, .json, .fig, .sketch)
 * @param {string} outputPath - Optional output path
 * @param {Object} options - { minConfidence: 0.60, dryRun: false, force: false, preset: null, tolerance: 2 }
 */
function processFile(inputPath, outputPath = null, options = {}) {
  const detection = detectFormat(inputPath);
  if (detection.format === SourceFormat.UNKNOWN) {
    throw new Error(`Unsupported or unrecognized file format: ${inputPath}`);
  }

  // 1. Parse document
  const parsedDoc = parseDocument(inputPath);

  // 2. Plan conversion
  const plan = planConversion(parsedDoc, options);

  // 3. Validate plan
  const validation = validatePlan(parsedDoc, plan);

  const result = {
    inputPath,
    outputPath,
    format: detection.format,
    documentName: parsedDoc.name,
    conversionPlan: plan,
    validation,
    dryRun: Boolean(options.dryRun)
  };

  if (options.dryRun) {
    return result;
  }

  // 4. Apply conversion in-memory
  const rawDoc = JSON.parse(JSON.stringify(parsedDoc.rawDoc));
  const { appliedCount, documentJson } = applyConversionToDocumentJson(rawDoc, plan);
  result.appliedCount = appliedCount;

  // 5. If output requested, save to destination
  if (outputPath) {
    const ext = path.extname(outputPath).toLowerCase();
    const resolvedOut = path.resolve(outputPath);
    const outDir = path.dirname(resolvedOut);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    if (ext === '.json') {
      fs.writeFileSync(resolvedOut, JSON.stringify(documentJson, null, 2), 'utf8');
      result.savedPath = resolvedOut;
    } else if (ext === '.figcraft') {
      // Pack document.json back into a .figcraft zip archive using Python zipfile
      const tempJson = path.join(outDir, `temp_pack_${Date.now()}.json`);
      fs.writeFileSync(tempJson, JSON.stringify(documentJson, null, 2), 'utf8');

      // Check if input was a .figcraft with images/thumbnail to copy forward
      let copyArg = '';
      if (detection.format === SourceFormat.FIGCRAFT_ARCHIVE && fs.existsSync(inputPath)) {
        copyArg = `\nimport shutil\nwith zipfile.ZipFile(r"${inputPath}", "r") as zin, zipfile.ZipFile(r"${resolvedOut}", "w", zipfile.ZIP_DEFLATED) as zout:\n  zout.write(r"${tempJson}", "document.json")\n  for item in zin.infolist():\n    if item.filename != "document.json":\n      zout.writestr(item, zin.read(item.filename))`;
      } else {
        copyArg = `\nwith zipfile.ZipFile(r"${resolvedOut}", "w", zipfile.ZIP_DEFLATED) as zout:\n  zout.write(r"${tempJson}", "document.json")`;
      }

      spawnSync('python', ['-c', `import zipfile${copyArg}`], { encoding: 'utf8' });
      if (fs.existsSync(tempJson)) fs.unlinkSync(tempJson);
      result.savedPath = resolvedOut;
    }
  }

  return result;
}

module.exports = {
  // Canonical Model
  LayoutDirection,
  MainAlignment,
  CrossAlignment,
  SizingMode,
  ConfidenceLevel,
  createLayoutConfig,
  createChildLayoutConfig,
  createPreset,

  // Pipeline Stages
  detectFormat,
  SourceFormat,
  parseDocument,
  normalizeDocumentJson,
  inferContainerLayout,
  getStats,
  checkOverlap,
  planConversion,
  applyConversionToDocumentJson,
  generateCommandBatch,
  validateContainerFidelity,
  validatePlan,

  // Presets & Orchestration
  PresetManager,
  DEFAULT_PRESETS_FILE,
  processFile
};

