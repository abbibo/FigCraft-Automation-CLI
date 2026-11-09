/**
 * Extended Auto-Adaptive MCP Server Proxy for FigCraft
 * 
 * Capabilities:
 * 1. Checks if FigCraft desktop app is running with control server on port 47800.
 *    - Connects in Attached Mode (Live Canvas Sync) if online.
 *    - Falls back to Headless Mode (in-process engine session) if offline.
 * 2. Enhances the MCP Tool Registry with High-Level Composite Tools:
 *    - `scaffold_ui_card`: Build modern, responsive UI cards with auto-layout and typography.
 *    - `generate_color_palette`: Build design token swatch grids with labels and hex codes.
 *    - `scaffold_navbar`: Build responsive website navigation bars with brand and links.
 *    - `batch_export_all_frames`: Export all top-level frames on the canvas in one command.
 * 3. Transparently proxies standard native FigCraft tools and JSON-RPC messages.
 */

const net = require('net');
const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const CLI_PATH = 'C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe';
const PORT = 47800;
const HOST = '127.0.0.1';

// Custom Composite Tools definitions
const EXTENDED_TOOLS = [
  {
    name: "scaffold_ui_card",
    title: "Scaffold UI Card",
    description: "Composite Tool: Generates a complete, production-ready UI Card with auto-layout, title, description, optional badge pill, and action button in FigCraft.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Card title text" },
        description: { type: "string", description: "Card description text" },
        buttonText: { type: "string", description: "Action button label (default: 'Get Started')" },
        tag: { type: "string", description: "Optional badge/pill tag (e.g. 'NEW', 'PRO', 'SALE')" },
        theme: { type: "string", enum: ["light", "dark"], description: "Color theme (default: 'light')" },
        x: { type: "number", description: "X position on canvas in page coordinates (default: 100)" },
        y: { type: "number", description: "Y position on canvas in page coordinates (default: 100)" },
        width: { type: "number", description: "Card width in pixels (default: 340)" }
      },
      required: ["title", "description"]
    }
  },
  {
    name: "generate_color_palette",
    title: "Generate Color Palette",
    description: "Composite Tool: Generates an organized design token color palette frame with swatch boxes, color names, and hex codes in FigCraft.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Palette frame title (default: 'Design Tokens')" },
        colors: {
          type: "array",
          items: { type: "string" },
          description: "Array of hex color strings (e.g. ['#0F172A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'])"
        },
        x: { type: "number", description: "X position on canvas (default: 100)" },
        y: { type: "number", description: "Y position on canvas (default: 100)" }
      }
    }
  },
  {
    name: "scaffold_navbar",
    title: "Scaffold Website Navigation Bar",
    description: "Composite Tool: Generates a responsive website navigation header with brand icon/name, navigation links, and CTA button in FigCraft.",
    inputSchema: {
      type: "object",
      properties: {
        brandName: { type: "string", description: "Brand / project name (e.g. 'Acme App')" },
        links: {
          type: "array",
          items: { type: "string" },
          description: "Navigation link labels (default: ['Features', 'Solutions', 'Pricing', 'Docs'])"
        },
        ctaText: { type: "string", description: "CTA button label (default: 'Get Started')" },
        theme: { type: "string", enum: ["light", "dark"], description: "Color theme (default: 'light')" },
        width: { type: "number", description: "Navbar width in pixels (default: 1140)" },
        x: { type: "number", description: "X position on canvas (default: 100)" },
        y: { type: "number", description: "Y position on canvas (default: 50)" }
      },
      required: ["brandName"]
    }
  },
  {
    name: "batch_export_all_frames",
    title: "Batch Export All Frames",
    description: "Composite Tool: Inspects the active document page, identifies all top-level frames, and exports each one as PNG/SVG/PDF into an output folder.",
    inputSchema: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["png", "svg", "pdf", "webp", "jpg"], description: "Export format (default: 'png')" },
        scale: { type: "number", description: "Pixel scale multiplier (default: 2)" },
        outputDir: { type: "string", description: "Destination folder path (default: 'D:/Figma Agent/FinalOut')" }
      }
    }
  }
];

function checkPort(port, host, timeoutMs = 400) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeoutMs);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

function buildCardBatch(params) {
  const isDark = params.theme === 'dark';
  const width = params.width || 340;
  const x = params.x ?? 100;
  const y = params.y ?? 100;
  const btnText = params.buttonText || 'Get Started';

  const commands = [
    {
      as: 'rootCard',
      command: 'node.create',
      params: {
        type: 'frame',
        name: params.title + ' Card',
        x: x,
        y: y,
        width: width,
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

  if (params.tag) {
    commands.push(
      {
        as: 'tagBadge',
        command: 'node.create',
        params: {
          parent: { '$ref': 'rootCard' },
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
          text: params.tag.toUpperCase(),
          props: {
            fontSize: 11,
            fill: '#0284C7'
          }
        }
      }
    );
  }

  commands.push(
    {
      as: 'titleNode',
      command: 'node.create',
      params: {
        parent: { '$ref': 'rootCard' },
        type: 'text',
        name: 'Title',
        text: params.title,
        props: {
          fontSize: 18,
          fill: isDark ? '#F8FAFC' : '#0F172A',
          sizingH: 'fill'
        }
      }
    },
    {
      as: 'descNode',
      command: 'node.create',
      params: {
        parent: { '$ref': 'rootCard' },
        type: 'text',
        name: 'Description',
        text: params.description,
        props: {
          fontSize: 14,
          fill: isDark ? '#94A3B8' : '#64748B',
          sizingH: 'fill'
        }
      }
    },
    {
      as: 'btnNode',
      command: 'node.create',
      params: {
        parent: { '$ref': 'rootCard' },
        type: 'frame',
        name: 'Action Button',
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
        parent: { '$ref': 'btnNode' },
        type: 'text',
        name: 'Button Text',
        text: btnText,
        props: {
          fontSize: 14,
          fill: '#FFFFFF'
        }
      }
    }
  );

  return commands;
}

function buildPaletteBatch(params) {
  const paletteName = params.name || 'Design Tokens';
  const colors = (params.colors && params.colors.length > 0)
    ? params.colors
    : ["#0F172A", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  const x = params.x ?? 100;
  const y = params.y ?? 100;

  const commands = [
    {
      as: 'paletteRoot',
      command: 'node.create',
      params: {
        type: 'frame',
        name: paletteName,
        x: x,
        y: y,
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

  colors.forEach((hex, idx) => {
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
          name: 'Color Preview',
          width: 80,
          height: 80,
          props: {
            cornerRadius: 8,
            fill: hex
          }
        }
      },
      {
        command: 'node.create',
        params: {
          parent: { '$ref': swatchRef },
          type: 'text',
          name: 'Hex Label',
          text: hex.toUpperCase(),
          props: {
            fontSize: 12,
            fill: '#0F172A'
          }
        }
      }
    );
  });

  return commands;
}

function buildNavbarBatch(params) {
  const isDark = params.theme === 'dark';
  const width = params.width || 1140;
  const x = params.x ?? 100;
  const y = params.y ?? 50;
  const brand = params.brandName || 'Brand';
  const links = (params.links && params.links.length > 0)
    ? params.links
    : ['Features', 'Solutions', 'Pricing', 'Docs'];
  const cta = params.ctaText || 'Get Started';

  const commands = [
    {
      as: 'navRoot',
      command: 'node.create',
      params: {
        type: 'frame',
        name: `${brand} Navigation Bar`,
        x: x,
        y: y,
        width: width,
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
        name: 'Brand Logo Mark',
        width: 28,
        height: 28,
        props: {
          cornerRadius: 6,
          fill: '#2563EB'
        }
      }
    },
    {
      command: 'node.create',
      params: {
        parent: { '$ref': 'brandCluster' },
        type: 'text',
        name: 'Brand Text',
        text: brand,
        props: {
          fontSize: 16,
          fill: isDark ? '#FFFFFF' : '#0F172A'
        }
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

  links.forEach((linkText) => {
    commands.push({
      command: 'node.create',
      params: {
        parent: { '$ref': 'linksCluster' },
        type: 'text',
        name: linkText,
        text: linkText,
        props: {
          fontSize: 14,
          fill: isDark ? '#94A3B8' : '#64748B'
        }
      }
    });
  });

  commands.push(
    {
      as: 'ctaButton',
      command: 'node.create',
      params: {
        parent: { '$ref': 'navRoot' },
        type: 'frame',
        name: 'CTA Button',
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
        parent: { '$ref': 'ctaButton' },
        type: 'text',
        name: 'CTA Text',
        text: cta,
        props: {
          fontSize: 14,
          fill: '#FFFFFF'
        }
      }
    }
  );

  return commands;
}

async function main() {
  const isAttachedAvailable = await checkPort(PORT, HOST);

  const args = ['mcp'];
  if (isAttachedAvailable) {
    args.push('--attach', String(PORT));
  }

  // Forward any additional user arguments
  const extraArgs = process.argv.slice(2);
  args.push(...extraArgs);

  const child = spawn(CLI_PATH, args, {
    stdio: ['pipe', 'pipe', 'inherit'],
    windowsHide: true,
  });

  child.on('error', (err) => {
    console.error('Failed to start figcraft-cli:', err);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    process.exit(code ?? (signal ? 1 : 0));
  });

  // Keep track of pending requests by ID
  let internalReqCounter = 100000;
  const pendingRequests = new Map();

  function callChild(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++internalReqCounter;
      pendingRequests.set(id, { resolve, reject });
      const req = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };
      child.stdin.write(JSON.stringify(req) + '\n');
    });
  }

  // Read lines from child process stdout
  const childRl = readline.createInterface({ input: child.stdout });

  childRl.on('line', (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line);

      // Check if it's a response to one of our internal requests
      if (msg.id && pendingRequests.has(msg.id)) {
        const { resolve } = pendingRequests.get(msg.id);
        pendingRequests.delete(msg.id);
        resolve(msg);
        return;
      }

      // Check if it's a response to a client's tools/list request
      if (msg.id && clientWaitingToolsList.has(msg.id)) {
        clientWaitingToolsList.delete(msg.id);
        if (msg.result && Array.isArray(msg.result.tools)) {
          // Merge custom composite tools
          msg.result.tools.push(...EXTENDED_TOOLS);
        }
        process.stdout.write(JSON.stringify(msg) + '\n');
        return;
      }

      // Pass through normal response to client
      process.stdout.write(line + '\n');
    } catch (e) {
      // Non-JSON line from child, forward as-is
      process.stdout.write(line + '\n');
    }
  });

  const clientWaitingToolsList = new Set();
  const clientRl = readline.createInterface({ input: process.stdin });

  clientRl.on('line', async (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line);

      // Intercept tools/list
      if (msg.method === 'tools/list') {
        if (msg.id) clientWaitingToolsList.add(msg.id);
        child.stdin.write(line + '\n');
        return;
      }

      // Intercept tools/call for custom composite tools
      if (msg.method === 'tools/call' && msg.params && msg.params.name) {
        const toolName = msg.params.name;
        const args = msg.params.arguments || {};

        if (toolName === 'scaffold_ui_card') {
          try {
            const batchCmds = buildCardBatch(args);
            const res = await callChild('tools/call', {
              name: 'batch',
              arguments: { commands: batchCmds }
            });
            const response = {
              jsonrpc: '2.0',
              id: msg.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `UI Card '${args.title}' created successfully.\nBatch execution result:\n${JSON.stringify(res.result?.content || res.result, null, 2)}`
                  }
                ],
                isError: false
              }
            };
            process.stdout.write(JSON.stringify(response) + '\n');
          } catch (err) {
            process.stdout.write(JSON.stringify({
              jsonrpc: '2.0',
              id: msg.id,
              error: { code: -32603, message: err.message }
            }) + '\n');
          }
          return;
        }

        if (toolName === 'generate_color_palette') {
          try {
            const batchCmds = buildPaletteBatch(args);
            const res = await callChild('tools/call', {
              name: 'batch',
              arguments: { commands: batchCmds }
            });
            const response = {
              jsonrpc: '2.0',
              id: msg.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `Color Palette '${args.name || 'Design Tokens'}' generated successfully.\nBatch execution result:\n${JSON.stringify(res.result?.content || res.result, null, 2)}`
                  }
                ],
                isError: false
              }
            };
            process.stdout.write(JSON.stringify(response) + '\n');
          } catch (err) {
            process.stdout.write(JSON.stringify({
              jsonrpc: '2.0',
              id: msg.id,
              error: { code: -32603, message: err.message }
            }) + '\n');
          }
          return;
        }

        if (toolName === 'scaffold_navbar') {
          try {
            const batchCmds = buildNavbarBatch(args);
            const res = await callChild('tools/call', {
              name: 'batch',
              arguments: { commands: batchCmds }
            });
            const response = {
              jsonrpc: '2.0',
              id: msg.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `Navigation Bar for '${args.brandName}' created successfully.\nBatch execution result:\n${JSON.stringify(res.result?.content || res.result, null, 2)}`
                  }
                ],
                isError: false
              }
            };
            process.stdout.write(JSON.stringify(response) + '\n');
          } catch (err) {
            process.stdout.write(JSON.stringify({
              jsonrpc: '2.0',
              id: msg.id,
              error: { code: -32603, message: err.message }
            }) + '\n');
          }
          return;
        }

        if (toolName === 'batch_export_all_frames') {
          try {
            const format = args.format || 'png';
            const scale = args.scale || 2;
            const outputDir = path.resolve(args.outputDir || 'D:/Figma Agent/FinalOut');
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }

            // Inspect document to find top-level frames
            const inspectRes = await callChild('tools/call', {
              name: 'inspect_document',
              arguments: {}
            });

            let docData = {};
            if (inspectRes.result?.content?.[0]?.text) {
              docData = JSON.parse(inspectRes.result.content[0].text);
            }

            const page = docData.page || docData;
            const children = page.children || [];
            const frames = children.filter(c => c.type === 'frame');

            const exportedFiles = [];
            for (const frame of frames) {
              const safeName = (frame.name || 'frame_' + frame.id).replace(/[^a-zA-Z0-9_-]/g, '_');
              const filePath = path.join(outputDir, `${safeName}.${format}`);

              await callChild('tools/call', {
                name: 'export',
                arguments: {
                  ids: [frame.id],
                  format: format,
                  scale: scale,
                  path: filePath
                }
              });
              exportedFiles.push({ id: frame.id, name: frame.name, path: filePath });
            }

            process.stdout.write(JSON.stringify({
              jsonrpc: '2.0',
              id: msg.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `Exported ${exportedFiles.length} frame(s) to ${outputDir}:\n` +
                      exportedFiles.map(f => `- ${f.name} (id: ${f.id}) -> ${f.path}`).join('\n')
                  }
                ],
                isError: false
              }
            }) + '\n');
          } catch (err) {
            process.stdout.write(JSON.stringify({
              jsonrpc: '2.0',
              id: msg.id,
              error: { code: -32603, message: err.message }
            }) + '\n');
          }
          return;
        }
      }

      // Pass all standard requests transparently to child
      child.stdin.write(line + '\n');
    } catch (e) {
      // In case of parsing error, forward raw line
      child.stdin.write(line + '\n');
    }
  });
}

main();
