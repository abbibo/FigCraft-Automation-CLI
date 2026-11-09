/**
 * Universal FigCraft Task Executor:
 * Automatically runs design tasks in Attached Mode if the desktop app is open,
 * or Headless Mode if the desktop app is closed.
 *
 * Usage:
 *   node execute_figcraft_task.js <command> [args...]
 *
 * Examples:
 *   node execute_figcraft_task.js info "Antigravity space.figcraft"
 *   node execute_figcraft_task.js render "Antigravity space.figcraft" -o output.png
 */

const net = require('net');
const { spawn } = require('child_process');

const CLI_PATH = 'C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe';
const PORT = 47800;
const HOST = '127.0.0.1';

function checkPort(port, host, timeoutMs = 300) {
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
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function run() {
  const isAttached = await checkPort(PORT, HOST);
  const userArgs = process.argv.slice(2);

  if (userArgs.length === 0) {
    console.log(`[FigCraft Auto] Status: ${isAttached ? 'Attached Mode (Live UI Sync on port 47800)' : 'Headless Mode (In-process engine)'}`);
    console.log('Usage: node execute_figcraft_task.js <command> [args...]');
    return;
  }

  const isMcp = userArgs[0] === 'mcp';
  const finalArgs = [...userArgs];

  if (isMcp && isAttached && !finalArgs.includes('--attach')) {
    finalArgs.splice(1, 0, '--attach', String(PORT));
  }

  console.log(`[FigCraft Auto] Executing via ${isAttached ? 'ATTACHED MODE (Port 47800)' : 'HEADLESS MODE (Background Engine)'}...`);

  const child = spawn(CLI_PATH, finalArgs, { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code || 0));
}

run();

