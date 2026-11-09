@echo off
echo Building Palette Swatch Grid WebAssembly Plugin for FigCraft...

where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo Cargo / Rust is not installed or not in PATH.
    echo Please install Rust from https://rustup.rs and run:
    echo   rustup target add wasm32-unknown-unknown
    exit /b 1
)

cargo build --target wasm32-unknown-unknown --release
if %errorlevel% equ 0 (
    copy /Y target\wasm32-unknown-unknown\release\palette_swatch_grid.wasm palette_swatch_grid.wasm
    echo Build complete! Plugin binary updated: palette_swatch_grid.wasm
) else (
    echo Compilation failed.
)
