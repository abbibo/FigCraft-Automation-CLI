//! Palette Swatch Grid - FigCraft WebAssembly Plugin
//!
//! FigCraft executes plugins inside `wasmi` (pure-Rust WebAssembly interpreter).
//! Plugins have no OS access (no WASI) and interact with the canvas via host commands.

#![no_std]
extern crate alloc;

use alloc::format;
use alloc::string::String;
use alloc::vec;
use alloc::vec::Vec;

// FigCraft Host ABI imports
extern "C" {
    /// Dispatches a command to FigCraft's engine
    fn figcraft_run_command(cmd_ptr: *const u8, cmd_len: usize) -> i32;
    
    /// Optional logger to host terminal/status
    fn figcraft_log(msg_ptr: *const u8, msg_len: usize);
}

/// Helper to execute a command on FigCraft
fn run_command(json_command: &str) -> i32 {
    unsafe {
        figcraft_run_command(json_command.as_ptr(), json_command.len())
    }
}

/// Helper to log a message to FigCraft console
fn log(msg: &str) {
    unsafe {
        figcraft_log(msg.as_ptr(), msg.len());
    }
}

/// Plugin entry point called by FigCraft when the user clicks the plugin in the menu
#[no_mangle]
pub extern "C" fn run() -> i32 {
    log("FigCraft Palette Plugin: Starting execution...");

    // Default design palette (Tailwind-inspired core tokens)
    let colors = [
        ("#0F172A", "Slate 900"),
        ("#3B82F6", "Blue 500"),
        ("#10B981", "Emerald 500"),
        ("#F59E0B", "Amber 500"),
        ("#EF4444", "Red 500"),
        ("#8B5CF6", "Violet 500"),
    ];

    // 1. Create the container frame with horizontal auto-layout
    let frame_cmd = format!(
        r#"{{"command":"node.create","params":{{"type":"frame","name":"Design System Palette","x":100,"y":100,"props":{{"layout":"horizontal","gap":16,"padding":20,"cornerRadius":16,"fill":"#FFFFFF","stroke":"#E2E8F0","strokeWeight":1,"sizingH":"hug","sizingV":"hug"}}}}}}"#
    );
    run_command(&frame_cmd);

    // 2. Iterate and create swatches
    for (hex, label) in colors.iter() {
        // Individual swatch card (vertical auto layout)
        let swatch_card_cmd = format!(
            r#"{{"command":"node.create","params":{{"type":"frame","name":"{} Swatch","props":{{"layout":"vertical","gap":8,"padding":8,"cornerRadius":12,"fill":"#F8FAFC","sizingH":"hug","sizingV":"hug"}}}}}}"#,
            label
        );
        run_command(&swatch_card_cmd);

        // Color box
        let box_cmd = format!(
            r#"{{"command":"node.create","params":{{"type":"rectangle","name":"Color","width":80,"height":80,"props":{{"cornerRadius":8,"fill":"{}"}}}}}}"#,
            hex
        );
        run_command(&box_cmd);

        // Swatch name label
        let text_name_cmd = format!(
            r#"{{"command":"node.create","params":{{"type":"text","name":"Label","text":"{}","props":{{"fontSize":12,"fill":"#0F172A"}}}}}}"#,
            label
        );
        run_command(&text_name_cmd);

        // Swatch hex label
        let text_hex_cmd = format!(
            r#"{{"command":"node.create","params":{{"type":"text","name":"Hex","text":"{}","props":{{"fontSize":11,"fill":"#64748B"}}}}}}"#,
            hex
        );
        run_command(&text_hex_cmd);
    }

    log("FigCraft Palette Plugin: Finished creating palette swatches.");
    0
}

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}
