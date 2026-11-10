/**
 * Universal Document Parser for FigCraft
 * 
 * Safely parses .figcraft, .json, .fig, and .sketch files into a normalized
 * in-memory node graph. Uses native zip extraction or figcraft-cli convert as bridge.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { detectFormat, SourceFormat } = require('./detector');

const CLI_PATH = 'C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe';

/**
 * Parses a FigCraft document JSON object into normalized nodes.
 */
function normalizeDocumentJson(docJson) {
  if (!docJson || typeof docJson !== 'object') {
    throw new Error('Invalid document JSON: root must be an object');
  }

  const nodesMap = new Map();
  const rawNodes = docJson.nodes || {};

  for (const [idStr, raw] of Object.entries(rawNodes)) {
    const id = Number(raw.id) || idStr;
    
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;

    if (raw.bounds && typeof raw.bounds === 'object') {
      if (typeof raw.bounds.x === 'number') x = raw.bounds.x;
      if (typeof raw.bounds.y === 'number') y = raw.bounds.y;
      if (typeof raw.bounds.width === 'number') width = raw.bounds.width;
      if (typeof raw.bounds.height === 'number') height = raw.bounds.height;
    }

    if (Array.isArray(raw.transform) && raw.transform.length >= 6) {
      x = raw.transform[4];
      y = raw.transform[5];
    } else if (typeof raw.x === 'number') {
      x = raw.x;
      y = raw.y || 0;
    }

    if (typeof raw.width === 'number') width = raw.width;
    if (typeof raw.height === 'number') height = raw.height;

    const normalized = {
      id,
      name: raw.name || `Node ${id}`,
      type: (raw.type || 'unknown').toLowerCase(),
      parent: raw.parent ? Number(raw.parent) || raw.parent : null,
      children: Array.isArray(raw.children) ? raw.children.map(c => Number(c) || c) : [],
      bounds: { x, y, width, height },
      visible: raw.visible !== false,
      clip: Boolean(raw.clip),
      fills: raw.fills || [],
      strokes: raw.strokes || [],
      corners: raw.corners || null,
      text: raw.characters || raw.text || null,
      fontFamily: raw.font_family || raw.fontFamily || null,
      fontSize: raw.font_size || raw.fontSize || null,
      fontStyle: raw.font_style || raw.fontStyle || null,
      layout: raw.layout || null,
      childLayout: raw.child_layout || raw.childLayout || null,
      pluginData: raw.plugin_data || raw.pluginData || {},
      raw
    };

    nodesMap.set(id, normalized);
  }

  return {
    name: docJson.name || 'Untitled Document',
    currentPage: docJson.current_page || 1,
    nodes: nodesMap,
    rawDoc: docJson
  };
}

/**
 * Loads and parses a document from a file path or raw JSON string.
 */
function parseDocument(input) {
  // If JSON object already
  if (typeof input === 'object' && input !== null && !Buffer.isBuffer(input)) {
    return normalizeDocumentJson(input);
  }

  // If JSON string
  if (typeof input === 'string' && input.trim().startsWith('{')) {
    const parsed = JSON.parse(input);
    return normalizeDocumentJson(parsed);
  }

  // File path
  if (typeof input === 'string' && fs.existsSync(input)) {
    const detection = detectFormat(input);

    if (detection.format === SourceFormat.FIGCRAFT_JSON) {
      const text = fs.readFileSync(input, 'utf8');
      return normalizeDocumentJson(JSON.parse(text));
    }

    if (detection.format === SourceFormat.FIGCRAFT_ARCHIVE) {
      // Extract document.json using Python zipfile
      const pyExtract = spawnSync('python', [
        '-c',
        `import zipfile, sys; z = zipfile.ZipFile(r"${input}"); sys.stdout.write(z.read("document.json").decode("utf-8"))`
      ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

      if (pyExtract.status === 0 && pyExtract.stdout) {
        return normalizeDocumentJson(JSON.parse(pyExtract.stdout));
      }
    }

    // For .fig, .sketch, .penpot, or fallback: use figcraft-cli convert
    if (fs.existsSync(CLI_PATH)) {
      const tempOut = path.join(process.cwd(), 'FinalOut', `temp_parsed_${Date.now()}.json`);
      try {
        const conv = spawnSync(CLI_PATH, ['convert', input, tempOut], { encoding: 'utf8' });
        if (conv.status === 0 && fs.existsSync(tempOut)) {
          const jsonText = fs.readFileSync(tempOut, 'utf8');
          fs.unlinkSync(tempOut); // cleanup
          return normalizeDocumentJson(JSON.parse(jsonText));
        }
      } catch (err) {
        if (fs.existsSync(tempOut)) try { fs.unlinkSync(tempOut); } catch (e) {}
      }
    }

    throw new Error(`Unable to parse document format: ${detection.format} for file: ${input}`);
  }

  throw new Error('Unsupported input for parseDocument: expected file path or document JSON');
}

module.exports = {
  normalizeDocumentJson,
  parseDocument
};
