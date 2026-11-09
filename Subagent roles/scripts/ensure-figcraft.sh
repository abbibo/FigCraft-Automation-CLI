#!/usr/bin/env bash
# Auto-launch FigCraft GUI in attach mode (--control 7979) on macOS / Linux / WSL

set -e

PORT="${1:-7979}"
TIMEOUT_SEC="${2:-12}"

is_port_open() {
    if command -v nc >/dev/null 2>&1; then
        nc -z 127.0.0.1 "$PORT" >/dev/null 2>&1
        return $?
    elif command -v lsof >/dev/null 2>&1; then
        lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1
        return $?
    else
        (echo >/dev/tcp/127.0.0.1/"$PORT") >/dev/null 2>&1
        return $?
    fi
}

if is_port_open; then
    echo "STATUS=READY PORT=$PORT MODE=ATTACH"
    exit 0
fi

FIGCRAFT_BIN="${FIGCRAFT_PATH:-}"
if [ -z "$FIGCRAFT_BIN" ]; then
    if command -v figcraft >/dev/null 2>&1; then
        FIGCRAFT_BIN="$(command -v figcraft)"
    elif [ -x "/Applications/FigCraft.app/Contents/MacOS/figcraft" ]; then
        FIGCRAFT_BIN="/Applications/FigCraft.app/Contents/MacOS/figcraft"
    elif [ -x "/usr/local/bin/figcraft" ]; then
        FIGCRAFT_BIN="/usr/local/bin/figcraft"
    elif [ -x "/c/Program Files/FigCraft/figcraft.exe" ]; then
        FIGCRAFT_BIN="/c/Program Files/FigCraft/figcraft.exe"
    fi
fi

if [ -z "$FIGCRAFT_BIN" ]; then
    echo "ERROR: FigCraft binary not found. Set FIGCRAFT_PATH or add figcraft to PATH." >&2
    exit 1
fi

nohup "$FIGCRAFT_BIN" --control "$PORT" >/dev/null 2>&1 &
PID=$!

ELAPSED=0
while [ "$ELAPSED" -lt "$((TIMEOUT_SEC * 4))" ]; do
    sleep 0.25
    ELAPSED=$((ELAPSED + 1))
    if is_port_open; then
        echo "STATUS=STARTED PORT=$PORT PID=$PID MODE=ATTACH"
        exit 0
    fi
done

echo "ERROR: Timed out after ${TIMEOUT_SEC}s waiting for FigCraft on 127.0.0.1:$PORT" >&2
exit 1
