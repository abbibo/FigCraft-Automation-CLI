@echo off
echo Switching Antigravity FigCraft MCP to Option A: Headless Mode...
powershell -NoProfile -Command "$cfg = 'C:\Users\Abey1\.gemini\config\mcp_config.json'; $json = Get-Content $cfg -Raw | ConvertFrom-Json; $json.mcpServers.figcraft.args = @('mcp'); $json | ConvertTo-Json -Depth 5 | Set-Content $cfg -Encoding UTF8"
echo Done! Antigravity is now configured for Option A: Headless Mode (no GUI required).

