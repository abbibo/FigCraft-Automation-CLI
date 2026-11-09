param(
    [int]$Port = 7979,
    [int]$TimeoutSeconds = 12,
    [switch]$Restart
)

$ErrorActionPreference = "Stop"

# Auto-detect FigCraft executable across standard installation paths
$Candidates = @(
    $env:FIGCRAFT_PATH,
    "$env:ProgramFiles\FigCraft\figcraft.exe",
    "${env:ProgramFiles(x86)}\FigCraft\figcraft.exe",
    "$env:LOCALAPPDATA\Programs\FigCraft\figcraft.exe",
    "$env:LOCALAPPDATA\FigCraft\figcraft.exe"
)

$FigCraftExe = $null
foreach ($candidate in $Candidates) {
    if ($candidate -and (Test-Path $candidate)) {
        $FigCraftExe = $candidate
        break
    }
}

if (-not $FigCraftExe) {
    $cmd = Get-Command figcraft -ErrorAction SilentlyContinue
    if ($cmd) { $FigCraftExe = $cmd.Source }
}

if (-not $FigCraftExe) {
    Write-Error "FigCraft executable not found. Install FigCraft or set FIGCRAFT_PATH environment variable."
    exit 1
}

if ($Restart) {
    Get-Process -Name "figcraft" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Milliseconds 500
}

$conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
    Write-Output "STATUS=READY PORT=$Port PID=$($conn.OwningProcess) MODE=ATTACH EXE=`"$FigCraftExe`""
    exit 0
}

# Start FigCraft GUI with control port enabled
$proc = Start-Process -FilePath $FigCraftExe -ArgumentList "--control", "$Port" -PassThru

$elapsed = 0
$intervalMs = 250
$maxMs = $TimeoutSeconds * 1000

while ($elapsed -lt $maxMs) {
    Start-Sleep -Milliseconds $intervalMs
    $elapsed += $intervalMs
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($conn) {
        Write-Output "STATUS=STARTED PORT=$Port PID=$($conn.OwningProcess) MODE=ATTACH EXE=`"$FigCraftExe`""
        exit 0
    }
}

Write-Error "Timed out after ${TimeoutSeconds}s waiting for FigCraft control server on 127.0.0.1:$Port"
exit 1
