@echo off
echo Switching Antigravity FigCraft MCP to Option B: Attached Mode (Live Canvas Sync)...
powershell -NoProfile -Command "$cfg = 'C:\Users\Abey1\.gemini\config\mcp_config.json'; $json = Get-Content $cfg -Raw | ConvertFrom-Json; $json.mcpServers.figcraft.args = @('mcp', '--attach', '47800'); $json | ConvertTo-Json -Depth 5 | Set-Content $cfg -Encoding UTF8"
echo Launching FigCraft with control server on port 47800...
start "FigCraft Control" cmd /c ""C:\Program Files\ArtCraft\FigCraft\figcraft.exe" --control 47800 2>&1"
echo Done! Antigravity is now configured for Option B: Attached Mode.

