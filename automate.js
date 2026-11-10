#!/usr/bin/env node

/**
 * FigCraft Automation CLI & Scripting Toolkit
 * 
 * Provides instant command-line automation for FigCraft in both:
 * - Option A: Headless Mode (standalone in-process engine)
 * - Option B: Live Attached Mode (syncs with open FigCraft desktop app on port 47800)
 * 
 * Commands:
 *   node automate.js card --title "Card Title" --desc "Description" [--btn "Label"] [--tag "NEW"] [--dark]
 *   node automate.js palette [--colors "#0F172A,#3B82F6,#10B981"] [--name "Brand Palette"]
 *   node automate.js navbar --brand "Acme" [--links "Home,Docs,Pricing"] [--cta "Sign Up"] [--dark]
 *   node automate.js export [--out "D:\Figma Agent\FinalOut"] [--format png|svg|pdf] [--scale 2]
 *   node automate.js run <workflow````````````````````````.json>
 */

const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const net = require('net');

const CLI_PATH = 'C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe';
const PORT = 47800;
const HOST = '127.0.0.1';

function checkPort(port, host, timeoutMs = 400) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => { resolve(false); });
    socket.connect(port, host);
  });
}

class FigCraftSession {
  constructor() {
    this.child = null;
    this.rl = null;
    this.reqId = 0;
    this.pending = new Map();
  }

  async connect() {
    const isAttached = await checkPort(PORT, HOST);
    const args = ['mcp'];
    if (isAttached) {
      args.push('--attach', String(PORT));
      console.log(`[FigCraft Session] Connected in Attached Mode (Live Canvas on port ${PORT})`);
    } else {
      console.log(`[FigCraft Session] Connected in Headless Mode (In-process Engine)`);
    }

    this.child = spawn(CLI_PATH, args, { stdio: ['pipe', 'pipe', 'inherit'] });
    this.rl = readline.createInterface({ input: this.child.stdout });

    this.rl.on('line', (line) => {
      try {
        const msg = JSON.parse(line);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      } catch (e) {}
    });

    // Initialize MCP
    await this.call('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'figcraft-automation-cli', version: '1.0' }
    });
  }

  call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.reqId;
      this.pending.set(id, { resolve, reject });
      this.child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  async runCommand(command, params = {}) {
    return this.call('tools/call', {
      name: 'run_command',
      arguments: { command, params }
    });
  }

  async batch(commands, label = 'Automation Batch') {
    return this.call('tools/call', {
      name: 'batch',
      arguments: { commands, label }
    });
  }

  async inspectDocument() {
    const res = await this.call('tools/call', {
      name: 'inspect_document',
      arguments: {}
    });
    if (res.content?.[0]?.text) {
      return JSON.parse(res.content[0].text);
    }
    return res;
  }

  async exportNode(id, outPath, format = 'png', scale = 2) {
    return this.call('tools/call', {
      name: 'export',
      arguments: {
        ids: [id],
        path: outPath,
        format,
        scale
      }
    });
  }

  close() {
    if (this.child) {
      this.child.kill();
    }
  }
}

// CLI Arg Parsing Helper
function parseArgs(args) {
  const parsed = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        parsed[key] = next;
        i++;
      } else {
        parsed[key] = true;
      }
    } else {
      parsed._.push(arg);
    }
  }
  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command || command === 'help' || args.help) {
    console.log(`
FigCraft Automation CLI
-----------------------
Usage:
  node automate.js <command> [options]

Commands:
  card       Create a styled UI card frame with auto-layout
             --title <text>         Card title
             --desc <text>          Card description
             --btn <text>           Button label (default: 'Get Started')
             --tag <text>           Optional pill badge
             --dark                 Use dark theme (default: light)
             --x <n>, --y <n>       Canvas coordinates (default: 100, 100)
             --width <n>            Card width (default: 340)

  palette    Generate a design system color palette
             --name <text>          Palette title (default: 'Brand Palette')
             --colors <hex,...>     Comma-separated hex colors
             --x <n>, --y <n>       Canvas coordinates (default: 100, 100)

  navbar     Create a responsive navigation header
             --brand <text>         Brand / Project name
             --links <list,...>     Comma-separated links (e.g. 'Features,Docs,Pricing')
             --cta <text>           CTA button text (default: 'Sign Up')
             --dark                 Use dark theme (default: light)
             --width <n>            Header width (default: 1140)

  export     Export all top-level frames to images
             --out <folder>         Output directory (default: 'D:/Figma Agent/FinalOut')
             --format <fmt>         png | svg | pdf | webp (default: png)
             --scale <n>            Scale multiplier (default: 2)

  autolayout Convert or inspect design files for responsive Auto Layout
             --out <file>           Output file (.figcraft or .json)
             --confidence <n>       Confidence threshold (0-1, default: 0.60)
             --tolerance <n>        Geometric variance tolerance (px, default: 2)
             --force                Force re-conversion of existing auto-layout frames
             --dryRun               Preview plan without modifying file

  run        Execute a batch workflow JSON file
             node automate.js run <path/to/workflow.json>
`);
    process.exit(0);
  }

  const session = new FigCraftSession();
  await session.connect();

  try {
    switch (command) {
      case 'card': {
        const title = args.title || 'Welcome to FigCraft';
        const desc = args.desc || 'High-performance collaborative UI design built in pure Rust.';
        const btn = args.btn || 'Get Started';
        const isDark = Boolean(args.dark);
        const x = Number(args.x) || 100;
        const y = Number(args.y) || 100;
        const width = Number(args.width) || 340;

        console.log(`Creating UI Card: "${title}"...`);
        const commands = [
          {
            as: 'cardRoot',
            command: 'node.create',
            params: {
              type: 'frame',
              name: `${title} Card`,
              x, y, width,
              props: {
                layout: 'vertical',
                gap: 14,
                padding: 20,
                cornerRadius: 16,
                fill: isDark ? '#1E293B' : '#FFFFFF',
                stroke: isDark ? '#334155' : '#E2E8F0',
                strokeWeight: 1,
                sizingH: 'fixed',
                sizingV: 'hug'
              }
            }
          }
        ];

        if (args.tag) {
          commands.push(
            {
              as: 'tagBadge',
              command: 'node.create',
              params: {
                parent: { '$ref': 'cardRoot' },
                type: 'frame',
                name: 'Badge',
                props: {
                  layout: 'horizontal',
                  padding: [4, 10, 4, 10],
                  cornerRadius: 99,
                  fill: isDark ? '#38BDF820' : '#E0F2FE',
                  sizingH: 'hug',
                  sizingV: 'hug'
                }
              }
            },
            {
              command: 'node.create',
              params: {
                parent: { '$ref': 'tagBadge' },
                type: 'text',
                name: 'Badge Text',
                text: String(args.tag).toUpperCase(),
                props: { fontSize: 11, fill: '#0284C7' }
              }
            }
          );
        }

        commands.push(
          {
            as: 'titleText',
            command: 'node.create',
            params: {
              parent: { '$ref': 'cardRoot' },
              type: 'text',
              name: 'Title',
              text: title,
              props: { fontSize: 18, fill: isDark ? '#F8FAFC' : '#0F172A', sizingH: 'fill' }
            }
          },
          {
            as: 'descText',
            command: 'node.create',
            params: {
              parent: { '$ref': 'cardRoot' },
              type: 'text',
              name: 'Description',
              text: desc,
              props: { fontSize: 14, fill: isDark ? '#94A3B8' : '#64748B', sizingH: 'fill' }
            }
          },
          {
            as: 'btnFrame',
            command: 'node.create',
            params: {
              parent: { '$ref': 'cardRoot' },
              type: 'frame',
              name: 'Button',
              props: {
                layout: 'horizontal',
                padding: [10, 20, 10, 20],
                cornerRadius: 8,
                fill: '#2563EB',
                mainAlign: 'center',
                crossAlign: 'center',
                sizingH: 'hug',
                sizingV: 'hug'
              }
            }
          },
          {
            command: 'node.create',
            params: {
              parent: { '$ref': 'btnFrame' },
              type: 'text',
              name: 'Button Text',
              text: btn,
              props: { fontSize: 14, fill: '#FFFFFF' }
            }
          }
        );

        const res = await session.batch(commands, `Create Card: ${title}`);
        console.log('Success! Card created.');
        break;
      }

      case 'palette': {
        const name = args.name || 'Brand Design Tokens';
        const hexList = args.colors
          ? args.colors.split(',').map(s => s.trim())
          : ["#0F172A", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
        const x = Number(args.x) || 100;
        const y = Number(args.y) || 100;

        console.log(`Generating Palette: "${name}" (${hexList.length} swatches)...`);
        const commands = [
          {
            as: 'paletteRoot',
            command: 'node.create',
            params: {
              type: 'frame',
              name,
              x, y,
              props: {
                layout: 'horizontal',
                gap: 16,
                padding: 20,
                cornerRadius: 16,
                fill: '#FFFFFF',
                stroke: '#E2E8F0',
                strokeWeight: 1,
                sizingH: 'hug',
                sizingV: 'hug'
              }
            }
          }
        ];

        hexList.forEach((hex, idx) => {
          const swatchRef = `swatch_${idx}`;
          commands.push(
            {
              as: swatchRef,
              command: 'node.create',
              params: {
                parent: { '$ref': 'paletteRoot' },
                type: 'frame',
                name: `Swatch ${hex}`,
                props: {
                  layout: 'vertical',
                  gap: 8,
                  padding: 8,
                  cornerRadius: 12,
                  fill: '#F8FAFC',
                  sizingH: 'hug',
                  sizingV: 'hug'
                }
              }
            },
            {
              command: 'node.create',
              params: {
                parent: { '$ref': swatchRef },
                type: 'rectangle',
                name: 'Box',
                width: 80,
                height: 80,
                props: { cornerRadius: 8, fill: hex }
              }
            },
            {
              command: 'node.create',
              params: {
                parent: { '$ref': swatchRef },
                type: 'text',
                name: 'Hex',
                text: hex.toUpperCase(),
                props: { fontSize: 12, fill: '#0F172A' }
              }
            }
          );
        });

        await session.batch(commands, `Generate Palette: ${name}`);
        console.log('Success! Color palette generated.');
        break;
      }

      case 'navbar': {
        const brand = args.brand || 'Acme';
        const links = args.links ? args.links.split(',').map(s => s.trim()) : ['Features', 'Solutions', 'Docs', 'Pricing'];
        const cta = args.cta || 'Get Started';
        const isDark = Boolean(args.dark);
        const width = Number(args.width) || 1140;
        const x = Number(args.x) || 100;
        const y = Number(args.y) || 50;

        console.log(`Scaffolding Navbar for "${brand}"...`);
        const commands = [
          {
            as: 'navRoot',
            command: 'node.create',
            params: {
              type: 'frame',
              name: `${brand} Navigation Bar`,
              x, y, width,
              props: {
                layout: 'horizontal',
                padding: [16, 28, 16, 28],
                mainAlign: 'spaceBetween',
                crossAlign: 'center',
                cornerRadius: 12,
                fill: isDark ? '#0F172A' : '#FFFFFF',
                stroke: isDark ? '#1E293B' : '#E2E8F0',
                strokeWeight: 1,
                sizingH: 'fixed',
                sizingV: 'hug'
              }
            }
          },
          {
            as: 'brandCluster',
            command: 'node.create',
            params: {
              parent: { '$ref': 'navRoot' },
              type: 'frame',
              name: 'Brand',
              props: {
                layout: 'horizontal',
                gap: 12,
                crossAlign: 'center',
                sizingH: 'hug',
                sizingV: 'hug'
              }
            }
          },
          {
            command: 'node.create',
            params: {
              parent: { '$ref': 'brandCluster' },
              type: 'rectangle',
              name: 'Logo',
              width: 28,
              height: 28,
              props: { cornerRadius: 6, fill: '#2563EB' }
            }
          },
          {
            command: 'node.create',
            params: {
              parent: { '$ref': 'brandCluster' },
              type: 'text',
              name: 'Brand Name',
              text: brand,
              props: { fontSize: 16, fill: isDark ? '#FFFFFF' : '#0F172A' }
            }
          },
          {
            as: 'linksCluster',
            command: 'node.create',
            params: {
              parent: { '$ref': 'navRoot' },
              type: 'frame',
              name: 'Links',
              props: {
                layout: 'horizontal',
                gap: 28,
                crossAlign: 'center',
                sizingH: 'hug',
                sizingV: 'hug'
              }
            }
          }
        ];

        links.forEach((l) => {
          commands.push({
            command: 'node.create',
            params: {
              parent: { '$ref': 'linksCluster' },
              type: 'text',
              name: l,
              text: l,
              props: { fontSize: 14, fill: isDark ? '#94A3B8' : '#64748B' }
            }
          });
        });

        commands.push(
          {
            as: 'ctaBtn',
            command: 'node.create',
            params: {
              parent: { '$ref': 'navRoot' },
              type: 'frame',
              name: 'CTA',
              props: {
                layout: 'horizontal',
                padding: [8, 16, 8, 16],
                cornerRadius: 8,
                fill: '#2563EB',
                mainAlign: 'center',
                crossAlign: 'center',
                sizingH: 'hug',
                sizingV: 'hug'
              }
            }
          },
          {
            command: 'node.create',
            params: {
              parent: { '$ref': 'ctaBtn' },
              type: 'text',
              name: 'CTA Text',
              text: cta,
              props: { fontSize: 14, fill: '#FFFFFF' }
            }
          }
        );

        await session.batch(commands, `Scaffold Navbar: ${brand}`);
        console.log('Success! Navigation bar scaffolded.');
        break;
      }

      case 'export': {
        const outDir = path.resolve(args.out || 'D:/Figma Agent/FinalOut');
        const format = args.format || 'png';
        const scale = Number(args.scale) || 2;

        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        console.log(`Inspecting canvas for top-level frames...`);
        const doc = await session.inspectDocument();
        const page = doc.page || doc;
        const frames = (page.children || []).filter(c => c.type === 'frame');

        if (frames.length === 0) {
          console.log('No top-level frames found on current page.');
          break;
        }

        console.log(`Found ${frames.length} frame(s). Exporting to ${outDir}...`);
        for (const frame of frames) {
          const safeName = (frame.name || `frame_${frame.id}`).replace(/[^a-zA-Z0-9_-]/g, '_');
          const filePath = path.join(outDir, `${safeName}.${format}`);
          console.log(`  Exporting "${frame.name}" -> ${filePath}`);
          await session.exportNode(frame.id, filePath, format, scale);
        }
        console.log(`Export complete! All frames saved to: ${outDir}`);
        break;
      }

      case 'autolayout': {
        const inputFile = args._[1];
        if (!inputFile) {
          console.error('Error: Please specify an input design file (.figcraft, .json, .fig, .sketch)');
          process.exit(1);
        }
        const { processFile } = require('./src/auto-layout');
        const outPath = args.out || null;
        const dryRun = Boolean(args.dryRun);
        const force = Boolean(args.force);
        const minConfidence = typeof args.confidence !== 'undefined' ? Number(args.confidence) : 0.60;
        const tolerance = typeof args.tolerance !== 'undefined' ? Number(args.tolerance) : 2;

        console.log(`Analyzing document for Auto Layout: ${inputFile}...`);
        const result = processFile(inputFile, outPath, {
          minConfidence,
          tolerance,
          dryRun,
          force
        });

        console.log(`Document: "${result.documentName}" (Format: ${result.format})`);
        console.log(`Candidates: ${result.conversionPlan.totalCandidates} | Converted: ${result.conversionPlan.convertedCount} | Skipped: ${result.conversionPlan.skippedCount}`);
        
        for (const step of result.conversionPlan.plan) {
          console.log(`  ✓ Converted Frame "${step.containerName}" (ID ${step.containerId})`);
          console.log(`    Mode: ${step.layout.mode} | Gap: ${step.layout.gap}px | Padding: [${step.layout.padding.join(', ')}] | Confidence: ${step.confidence}`);
          console.log(`    Child elements: ${step.childUpdates.length} flow elements configured`);
        }

        if (result.conversionPlan.warnings.length > 0) {
          console.log('\nWarnings / Preserved absolute elements:');
          for (const w of result.conversionPlan.warnings) {
            console.log(`  ! [${w.name}]: ${w.reason}`);
          }
        }

        if (result.savedPath) {
          console.log(`\nSuccess! Converted design saved to: ${result.savedPath}`);
        } else if (dryRun) {
          console.log('\nDry run complete. No files were written.');
        }
        break;
      }

      case 'run': {
        const scriptFile = args._[1];
        if (!scriptFile || !fs.existsSync(scriptFile)) {
          console.error(`Error: File not found: ${scriptFile}`);
          process.exit(1);
        }
        const workflow = JSON.parse(fs.readFileSync(scriptFile, 'utf8'));
        const commands = Array.isArray(workflow) ? workflow : workflow.commands;
        if (!commands) {
          console.error(`Invalid workflow format. Expected an array of commands or an object with 'commands'.`);
          process.exit(1);
        }
        console.log(`Running workflow with ${commands.length} step(s)...`);
        await session.batch(commands, `Run Workflow: ${path.basename(scriptFile)}`);
        console.log(`Success! Workflow executed.`);
        break;
      }

      default:
        console.error(`Unknown command: ${command}. Run "node automate.js --help" for usage.`);
    }
  } catch (err) {
    console.error('Command execution failed:', err);
  } finally {
    session.close();
  }
}

main();
