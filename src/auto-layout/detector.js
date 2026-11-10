/**
 * Format Detector for Design Documents
 * 
 * Inspects file signatures, archive contents, and JSON schemas to identify:
 * - FigCraft Native (.figcraft)
 * - FigCraft / REST JSON (.json)
 * - Figma Binary (.fig)
 * - Sketch / InVision Craft Export (.sketch)
 * - Penpot Archive (.penpot)
 * - Clipboard Design Layers (HTML / Base64)
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SourceFormat = {
  FIGCRAFT_ARCHIVE: 'figcraft_archive',
  FIGCRAFT_JSON: 'figcraft_json',
  FIGMA_BINARY: 'figma_binary',
  SKETCH_CRAFT: 'sketch_craft',
  PENPOT: 'penpot',
  CLIPBOARD_HTML: 'clipboard_html',
  UNKNOWN: 'unknown'
};

/**
 * Reads the first N bytes of a file to detect magic headers.
 */
function readHeader(filePath, numBytes = 128) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(numBytes);
    fs.readSync(fd, buffer, 0, numBytes, 0);
    fs.closeSync(fd);
    return buffer;
  } catch (err) {
    return null;
  }
}

/**
 * Inspects ZIP archive entries using Python zipfile (available on system) or pure JS fallback.
 */
function getZipEntries(filePath) {
  try {
    const res = spawnSync('python', [
      '-c',
      `import zipfile, json; z = zipfile.ZipFile(r"${filePath}"); print(json.dumps(z.namelist()))`
    ], { encoding: 'utf8' });
    if (res.status === 0 && res.stdout) {
      return JSON.parse(res.stdout.trim());
    }
  } catch (e) {}
  return [];
}

/**
 * Detects format of a file path or in-memory string/buffer.
 */
function detectFormat(input) {
  // 1. In-memory string (JSON or HTML)
  if (typeof input === 'string' && (input.startsWith('{') || input.includes('<meta name="figma"'))) {
    if (input.includes('<meta name="figma"') || input.includes('data-figma')) {
      return {
        format: SourceFormat.CLIPBOARD_HTML,
        mimeType: 'text/html',
        confidence: 0.95,
        description: 'Figma / Design clipboard HTML payload'
      };
    }
    try {
      const parsed = JSON.parse(input);
      if (parsed.format === 'figcraft' || parsed.nodes) {
        return {
          format: SourceFormat.FIGCRAFT_JSON,
          mimeType: 'application/json',
          confidence: 0.95,
          version: parsed.format || '1.0',
          description: 'FigCraft document JSON representation'
        };
      }
    } catch (e) {}
  }

  // 2. File path inspection
  if (typeof input === 'string' && fs.existsSync(input)) {
    const ext = path.extname(input).toLowerCase();
    const stat = fs.statSync(input);
    const header = readHeader(input, 64);

    // Check ZIP header: PK\x03\x04
    const isZip = header && header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04;

    if (isZip) {
      const entries = getZipEntries(input);
      
      if (entries.includes('document.json') && entries.some(e => e.startsWith('images/') || e === 'thumbnail.png')) {
        return {
          format: SourceFormat.FIGCRAFT_ARCHIVE,
          mimeType: 'application/x-figcraft',
          extension: '.figcraft',
          confidence: 1.0,
          entries,
          size: stat.size,
          description: 'FigCraft native document archive'
        };
      }

      if (entries.includes('canvas.fig') || entries.includes('meta.json')) {
        return {
          format: SourceFormat.FIGMA_BINARY,
          mimeType: 'application/x-figma',
          extension: '.fig',
          confidence: 0.95,
          entries,
          size: stat.size,
          description: 'Figma binary design file'
        };
      }

      if (entries.includes('document.json') || entries.some(e => e.startsWith('pages/'))) {
        return {
          format: SourceFormat.SKETCH_CRAFT,
          mimeType: 'application/x-sketch',
          extension: '.sketch',
          confidence: 0.90,
          entries,
          size: stat.size,
          description: 'Sketch / InVision Craft exported document archive'
        };
      }

      if (entries.includes('manifest.json') && entries.some(e => e.includes('penpot'))) {
        return {
          format: SourceFormat.PENPOT,
          mimeType: 'application/x-penpot',
          extension: '.penpot',
          confidence: 0.90,
          entries,
          size: stat.size,
          description: 'Penpot design archive'
        };
      }
    }

    // JSON file check
    if (ext === '.json') {
      try {
        const text = fs.readFileSync(input, 'utf8');
        const parsed = JSON.parse(text);
        return {
          format: SourceFormat.FIGCRAFT_JSON,
          mimeType: 'application/json',
          extension: '.json',
          confidence: parsed.format === 'figcraft' ? 1.0 : 0.8,
          description: 'FigCraft JSON document file'
        };
      } catch (e) {}
    }

    // Best-effort extension match
    if (ext === '.figcraft') return { format: SourceFormat.FIGCRAFT_ARCHIVE, confidence: 0.7, extension: ext };
    if (ext === '.fig') return { format: SourceFormat.FIGMA_BINARY, confidence: 0.7, extension: ext };
    if (ext === '.sketch') return { format: SourceFormat.SKETCH_CRAFT, confidence: 0.7, extension: ext };
  }

  return {
    format: SourceFormat.UNKNOWN,
    confidence: 0.0,
    description: 'Unknown or unsupported file format'
  };
}

module.exports = {
  SourceFormat,
  detectFormat
};

